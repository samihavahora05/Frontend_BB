import fs from 'fs';
import path from 'path';

const backend = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';

// 1. Update AppointmentLetterService.php
const serviceCode = `<?php

namespace App\\Services;

use App\\Models\\AppointmentLetter;
use App\\Models\\InternshipApplication;
use App\\Models\\User;
use App\\Models\\AuditLog;
use Barryvdh\\DomPDF\\Facade\\Pdf;
use Illuminate\\Support\\Facades\\Storage;
use Illuminate\\Support\\Str;

class AppointmentLetterService
{
    /**
     * Format working days array/string to professional text.
     */
    public function formatWorkingDays($days): string
    {
        if (is_string($days) && !empty($days)) {
            return $days;
        }
        if (!is_array($days) || empty($days)) {
            return 'Monday to Friday';
        }

        $standard = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        if ($days === $standard || count(array_diff($standard, $days)) === 0 && count(array_diff($days, $standard)) === 0) {
            return 'Monday to Friday';
        }
        if (count($days) === 1) {
            return $days[0];
        }
        if (count($days) === 2) {
            return $days[0] . ' and ' . $days[1];
        }
        $last = array_pop($days);
        return implode(', ', $days) . ' and ' . $last;
    }

    /**
     * Format dates consistently (e.g., 07 September 2026).
     */
    public function formatDate($date): string
    {
        if (empty($date)) {
            return now()->format('d F Y');
        }
        try {
            return \\Carbon\\Carbon::parse($date)->format('d F Y');
        } catch (\\Throwable $e) {
            return (string)$date;
        }
    }

    /**
     * Format compensation with proper currency symbol.
     */
    public function formatCompensation($amount, $currency = '₹', $frequency = 'month'): string
    {
        if ($amount === null || $amount === '' || $amount === 0 || $amount === '0') {
            return 'Fixed Allowance / Performance Based';
        }
        if (is_numeric($amount)) {
            $curr = !empty($currency) ? $currency : '₹';
            return $curr . number_format((float)$amount) . ' per ' . ($frequency ?: 'month');
        }
        return (string)$amount;
    }

    /**
     * Generate an official Appointment Letter PDF with dynamic details & DejaVu Sans Unicode support.
     */
    public function generate(InternshipApplication $application, ?int $generatedBy = null, array $options = []): AppointmentLetter
    {
        $application->load(['user', 'internship.company.companyProfile']);

        // Reference number: use custom admin ref or generate unique
        $referenceNumber = !empty($options['reference_number']) 
            ? $options['reference_number'] 
            : ('BB-AL-' . date('Y') . '-' . str_pad((string)$application->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(4)));

        $issueDate = $this->formatDate($options['issue_date'] ?? now());

        // Candidate details (auto-fetched)
        $applicantName = $application->applicant_name;
        $applicantEmail = $application->applicant_email;
        $applicantPhone = $application->applicant_phone;
        $college = $application->user?->college ?? $application->college ?? null;
        $degree = $application->degree ?? null;
        $location = $options['work_location'] ?? ($application->internship?->location ?? 'Vadodara, Gujarat');
        $mode = $options['work_mode'] ?? ($application->internship?->mode ?? 'Onsite');

        // Appointment specific details (from Admin options or application fallback)
        $designation = $options['designation'] ?? ($application->internship?->title ?? $application->application_type ?? 'Backend Developer Intern');
        $department = $options['department'] ?? ($application->internship?->department ?? 'Engineering & Development');
        
        $startDate = $this->formatDate($options['start_date'] ?? ($application->internship?->start_date ?? now()));
        $endDate = !empty($options['end_date']) ? $this->formatDate($options['end_date']) : null;
        
        $duration = $options['duration'] ?? ($application->internship?->duration ?? '6 Months');
        $workingDays = $this->formatWorkingDays($options['working_days'] ?? 'Monday to Friday');
        $workingHours = $options['working_hours'] ?? '09:30 AM - 06:30 PM';
        $breakTime = $options['break_time'] ?? '01:00 PM - 02:00 PM';
        $reportingTime = $options['reporting_time'] ?? '09:30 AM';
        
        $stipendAmount = $options['stipend_amount'] ?? ($application->internship?->stipend ?? 18000);
        $stipendCurrency = $options['stipend_currency'] ?? '₹';
        $paymentFrequency = $options['payment_frequency'] ?? 'month';
        $formattedStipend = $this->formatCompensation($stipendAmount, $stipendCurrency, $paymentFrequency);

        $reportingTo = $options['reporting_to'] ?? 'Team Lead / Project Manager';
        $reportingPersonName = $options['reporting_person_name'] ?? null;
        
        $companyName = 'BLUEBOXX DA PVT. LTD.';
        $signedAt = $this->formatDate($application->signed_at ?? now());

        // Candidate signature base64 data URI
        $candidateSigData = null;
        if (!empty($application->signature_path) && Storage::disk('local')->exists($application->signature_path)) {
            $rawContent = Storage::disk('local')->get($application->signature_path);
            $mime = (str_ends_with(strtolower($application->signature_path), '.jpg') || str_ends_with(strtolower($application->signature_path), '.jpeg')) ? 'image/jpeg' : 'image/png';
            $candidateSigData = 'data:' . $mime . ';base64,' . base64_encode($rawContent);
        }

        // Admin signature base64 data URI
        $adminSigData = null;
        $adminSigPath = $options['admin_signature_path'] ?? null;
        if (!empty($adminSigPath) && Storage::disk('local')->exists($adminSigPath)) {
            $rawContent = Storage::disk('local')->get($adminSigPath);
            $mime = (str_ends_with(strtolower($adminSigPath), '.jpg') || str_ends_with(strtolower($adminSigPath), '.jpeg')) ? 'image/jpeg' : 'image/png';
            $adminSigData = 'data:' . $mime . ';base64,' . base64_encode($rawContent);
        } elseif (!empty($options['admin_signature_data'])) {
            $adminSigData = $options['admin_signature_data'];
        }

        $signatoryName = $options['signatory_name'] ?? 'Authorized Signatory';
        $signatoryDesignation = $options['signatory_designation'] ?? 'Managing Director / HR Head';

        // Official clean letterhead background
        $letterheadBg = null;
        $bgPath = storage_path('app/letterhead_bg.png');
        if (file_exists($bgPath)) {
            $letterheadBg = 'data:image/png;base64,' . base64_encode(file_get_contents($bgPath));
        } elseif (file_exists(public_path('images/letterhead_bg.png'))) {
            $letterheadBg = 'data:image/png;base64,' . base64_encode(file_get_contents(public_path('images/letterhead_bg.png')));
        }

        $data = [
            'reference_number'         => $referenceNumber,
            'issue_date'               => $issueDate,
            'applicant_name'           => $applicantName,
            'applicant_email'          => $applicantEmail,
            'applicant_phone'          => $applicantPhone,
            'college'                  => $college,
            'degree'                   => $degree,
            'designation'              => $designation,
            'department'               => $department,
            'start_date'               => $startDate,
            'end_date'                 => $endDate,
            'duration'                 => $duration,
            'working_days'             => $workingDays,
            'working_hours'            => $workingHours,
            'break_time'               => $breakTime,
            'reporting_time'           => $reportingTime,
            'stipend'                  => $formattedStipend,
            'stipend_amount'           => $stipendAmount,
            'stipend_currency'         => $stipendCurrency,
            'payment_frequency'        => $paymentFrequency,
            'reporting_to'             => $reportingTo,
            'reporting_person_name'    => $reportingPersonName,
            'location'                 => $location,
            'mode'                     => $mode,
            'company_name'             => $companyName,
            'signed_at'                => $signedAt,
            'candidate_signature_data' => $candidateSigData,
            'admin_signature_data'     => $adminSigData,
            'signatory_name'           => $signatoryName,
            'signatory_designation'    => $signatoryDesignation,
            'letterhead_bg'            => $letterheadBg,
            'application_id'           => $application->id,
        ];

        // Render with DomPDF using DejaVu Sans for native UTF-8 Unicode glyphs (Rupee ₹, dashes, bullets)
        $pdf = Pdf::loadView('pdf.appointment_letter', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'defaultFont'          => 'DejaVu Sans',
                'isFontSubsettingEnabled' => true,
            ]);

        $fileName = $referenceNumber . '.pdf';
        $storageRelativePath = 'appointment_letters/' . $fileName;

        if (!Storage::disk('local')->exists('appointment_letters')) {
            Storage::disk('local')->makeDirectory('appointment_letters');
        }

        Storage::disk('local')->put($storageRelativePath, $pdf->output());

        // Update application state
        $application->update([
            'appointment_letter_path'         => $storageRelativePath,
            'appointment_letter_generated_at' => now(),
        ]);

        // Persist structured metadata into appointment_letters table
        $record = AppointmentLetter::updateOrCreate(
            ['application_id' => $application->id],
            [
                'user_id'          => $application->user_id,
                'reference_number' => $referenceNumber,
                'file_path'        => $storageRelativePath,
                'document_version' => 'v2.1',
                'generated_by'     => $generatedBy,
                'generated_at'     => now(),
                'metadata'         => [
                    'designation'           => $designation,
                    'department'            => $department,
                    'start_date'            => $startDate,
                    'end_date'              => $endDate,
                    'duration'              => $duration,
                    'working_days'          => $workingDays,
                    'working_hours'         => $workingHours,
                    'break_time'            => $breakTime,
                    'reporting_time'        => $reportingTime,
                    'stipend_amount'        => $stipendAmount,
                    'stipend_currency'      => $stipendCurrency,
                    'payment_frequency'     => $paymentFrequency,
                    'formatted_stipend'     => $formattedStipend,
                    'reporting_to'          => $reportingTo,
                    'reporting_person_name' => $reportingPersonName,
                    'work_location'         => $location,
                    'work_mode'             => $mode,
                    'issue_date'            => $issueDate,
                    'signatory_name'        => $signatoryName,
                    'signatory_designation' => $signatoryDesignation,
                    'has_candidate_sig'     => !empty($candidateSigData),
                    'has_admin_sig'         => !empty($adminSigData),
                ],
            ]
        );

        return $record;
    }
}
`;

// 2. Update appointment_letter.blade.php with DejaVu Sans & Professional 1-Page Layout
const templateCode = `<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>Appointment Letter - {{ $reference_number }}</title>
<style>
  @page {
    size: a4 portrait;
    margin: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'DejaVu Sans', sans-serif;
  }
  body {
    font-family: 'DejaVu Sans', sans-serif;
    font-size: 10.5px;
    line-height: 1.42;
    color: #1a202c;
    background: #ffffff;
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
  }

  /* Full Page Official Background Letterhead */
  .letterhead-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 210mm;
    height: 297mm;
    z-index: 1;
  }

  /* Document Body Content positioned between letterhead top and bottom */
  .content-wrapper {
    position: relative;
    z-index: 10;
    padding-top: 132px;
    padding-bottom: 75px;
    padding-left: 48px;
    padding-right: 48px;
  }

  .doc-title {
    text-align: center;
    font-size: 14.5px;
    font-weight: bold;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #0d1b3e;
    margin-bottom: 10px;
  }

  .meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
    font-size: 10px;
  }

  .recipient-block {
    margin-bottom: 10px;
    font-size: 10.5px;
    line-height: 1.38;
  }

  .subject-line {
    font-size: 11px;
    font-weight: bold;
    color: #0d1b3e;
    margin-bottom: 9px;
  }

  p {
    margin-bottom: 8px;
    text-align: justify;
    font-size: 10.5px;
    line-height: 1.42;
  }

  ul.clauses-list {
    margin: 4px 0 9px 20px;
    padding: 0;
  }

  ul.clauses-list li {
    font-size: 10.5px;
    line-height: 1.38;
    margin-bottom: 4px;
  }

  .signatures-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .sig-col {
    width: 50%;
    vertical-align: top;
  }

  .sig-img-container {
    height: 48px;
    margin: 3px 0;
  }

  .sig-img {
    max-height: 44px;
    max-width: 140px;
    display: block;
  }

  .sig-text-stamp {
    font-size: 10.5px;
    font-style: italic;
    color: #0d1b3e;
    font-weight: bold;
    padding-top: 12px;
  }

  .sig-line {
    border-top: 1px solid #374151;
    padding-top: 3px;
    font-size: 9.5px;
    line-height: 1.3;
  }

  .badge-signed {
    font-size: 8.5px;
    color: #059669;
    font-weight: bold;
  }
</style>
</head>
<body>

@if(!empty($letterhead_bg))
  <img src="{{ $letterhead_bg }}" class="letterhead-bg" alt="Letterhead Background" />
@endif

<div class="content-wrapper">
  
  <div class="doc-title">Appointment Letter</div>

  <table class="meta-table">
    <tr>
      <td style="text-align: left;"><strong>Ref No:</strong> {{ $reference_number }}</td>
      <td style="text-align: right;"><strong>Date:</strong> {{ $issue_date }}</td>
    </tr>
  </table>

  <div class="recipient-block">
    <strong>To,</strong><br>
    <strong style="font-size: 11px; color: #0d1b3e;">{{ $applicant_name }}</strong><br>
    @if(!empty($degree))<span>{{ $degree }}</span>@if(!empty($college)), <span>{{ $college }}</span>@endif<br>@endif
    <span>{{ $location }}</span> | <span>{{ $applicant_email }}</span> | <span>{{ $applicant_phone }}</span>
  </div>

  <div class="subject-line">
    Subject: Appointment as {{ $designation }}
  </div>

  <p>Dear <strong>{{ $applicant_name }}</strong>,</p>

  <p>
    We are pleased to appoint you as a <strong>{{ $designation }}</strong> (Department: {{ $department }}) at <strong>{{ $company_name }}</strong>, effective <strong>{{ $start_date }}</strong>@if(!empty($end_date)) until <strong>{{ $end_date }}</strong>@endif. You will report to the designated <strong>{{ $reporting_to }}</strong>@if(!empty($reporting_person_name)) ({{ $reporting_person_name }})@endif.
  </p>

  <p>
    Your initial place of work will be <strong>{{ $location }}</strong> ({{ $mode }}), although transfers may occur as needed to meet business requirements. Working hours will follow company policy (<strong>{{ $working_hours }}, {{ $working_days }}</strong>@if(!empty($break_time)), with lunch/break from {{ $break_time }}@endif).
  </p>

  <ul class="clauses-list">
    <li>Your gross stipend / compensation will be <strong>{{ $stipend }}</strong>, subject to applicable taxes, company regulations, and attendance.</li>
    <li>You will be on a <strong>{{ $duration }}</strong> probationary / internship evaluation period, after which performance will be formally reviewed.</li>
    <li>You are entitled to company-authorized leaves and professional certification upon successful completion of assignments.</li>
  </ul>

  <p>
    This appointment may be terminated by either party with <strong>15 days</strong> written notice or payment in lieu of notice.
  </p>

  <p>
    Kindly sign and return a copy of this letter as confirmation of your acceptance. We welcome you aboard and wish you success in your new role.
  </p>

  <div style="font-size: 10px; font-weight: bold; margin-top: 6px; margin-bottom: 2px;">Warm regards,</div>

  <!-- Dual Signatures Side-by-Side Table -->
  <table class="signatures-table">
    <tr>
      <!-- Left: Admin Authorized Signatory -->
      <td class="sig-col" style="padding-right: 16px;">
        <div style="font-size: 10px; font-weight: bold; color: #0d1b3e;">
          BLUEBOXX DA PVT. LTD.
        </div>
        <div class="sig-img-container">
          @if(!empty($admin_signature_data))
            <img src="{{ $admin_signature_data }}" class="sig-img" alt="Admin Signature" />
          @else
            <div class="sig-text-stamp">[ Authorized Signatory ]</div>
          @endif
        </div>
        <div class="sig-line">
          <strong>{{ $signatory_name ?? 'Authorized Signatory' }}</strong><br>
          <span style="color: #4b5563;">{{ $signatory_designation ?? 'Managing Director / HR Head' }}</span><br>
          <span class="badge-signed">&#10003; Officially Authorized & Signed</span>
        </div>
      </td>

      <!-- Right: Candidate Acceptance -->
      <td class="sig-col" style="padding-left: 16px;">
        <div style="font-size: 10px; font-weight: bold; color: #0d1b3e;">
          Candidate Acceptance:
        </div>
        <div class="sig-img-container">
          @if(!empty($candidate_signature_data))
            <img src="{{ $candidate_signature_data }}" class="sig-img" alt="Candidate Signature" />
          @else
            <div class="sig-text-stamp">[ Digitally Signed ]</div>
          @endif
        </div>
        <div class="sig-line">
          <strong>{{ $applicant_name }}</strong><br>
          <span style="color: #4b5563;">Candidate / Appointee</span><br>
          <span class="badge-signed">&#10003; Digitally Accepted on {{ $signed_at }}</span>
        </div>
      </td>
    </tr>
  </table>

</div>

</body>
</html>
`;

fs.writeFileSync(path.join(backend, 'app', 'Services', 'AppointmentLetterService.php'), serviceCode);
fs.writeFileSync(path.join(backend, 'resources', 'views', 'pdf', 'appointment_letter.blade.php'), templateCode);

console.log('Successfully updated AppointmentLetterService.php and appointment_letter.blade.php with DejaVu Sans & dynamic parameters');
