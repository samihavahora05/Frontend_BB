import fs from 'fs';
import path from 'path';

const backend = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';

// 1. Update AppointmentLetterService.php
const serviceCode = `<?php

namespace App\Services;

use App\Models\AppointmentLetter;
use App\Models\InternshipApplication;
use App\Models\User;
use App\Models\AuditLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppointmentLetterService
{
    /**
     * Generate an official Appointment Letter PDF with dual signatures and persist record.
     *
     * @param InternshipApplication $application
     * @param int|null $generatedBy Admin ID who triggered generation
     * @param array $options Additional options (admin_signature_path, admin_signature_data, signatory_name, signatory_designation)
     * @return AppointmentLetter
     */
    public function generate(InternshipApplication $application, ?int $generatedBy = null, array $options = []): AppointmentLetter
    {
        $application->loadMissing(['user', 'internship.company.companyProfile']);

        $referenceNumber = 'BB-AL-' . date('Y') . '-' . str_pad((string)$application->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(4));
        $issueDate = now()->format('d/m/Y');

        // Resolve candidate details
        $applicantName = $application->applicant_name;
        $applicantEmail = $application->applicant_email;
        $applicantPhone = $application->applicant_phone;
        $position = $application->internship?->title ?? $application->application_type ?? 'Internship Specialist';
        $department = $application->internship?->department ?? 'Engineering & Development';
        $duration = $application->internship?->duration ?? ($application->internship?->duration_months ? $application->internship->duration_months . ' Months' : '6 Months');
        $stipend = $application->internship?->stipend > 0 ? ('Rs. ' . number_format($application->internship->stipend) . ' per month') : 'Performance Based / Fixed Allowance';
        $location = $application->internship?->location ?? 'Vadodara, Gujarat';
        $mode = $application->internship?->mode ?? 'Onsite';
        $companyName = 'BLUEBOXX DA PVT. LTD.';
        $startDate = $application->internship?->start_date ? \\Carbon\\Carbon::parse($application->internship->start_date)->format('d/m/Y') : now()->format('d/m/Y');
        $signedAt = $application->signed_at ? \\Carbon\\Carbon::parse($application->signed_at)->format('d/m/Y') : $issueDate;

        // Resolve candidate signature base64 data uri for DomPDF
        $candidateSigData = null;
        if (!empty($application->signature_path) && Storage::disk('local')->exists($application->signature_path)) {
            $rawContent = Storage::disk('local')->get($application->signature_path);
            $mime = 'image/png';
            if (str_ends_with(strtolower($application->signature_path), '.jpg') || str_ends_with(strtolower($application->signature_path), '.jpeg')) {
                $mime = 'image/jpeg';
            }
            $candidateSigData = 'data:' . $mime . ';base64,' . base64_encode($rawContent);
        }

        // Resolve admin signature base64 data uri for DomPDF
        $adminSigData = null;
        $adminSigPath = $options['admin_signature_path'] ?? null;
        if (!empty($adminSigPath) && Storage::disk('local')->exists($adminSigPath)) {
            $rawContent = Storage::disk('local')->get($adminSigPath);
            $mime = 'image/png';
            if (str_ends_with(strtolower($adminSigPath), '.jpg') || str_ends_with(strtolower($adminSigPath), '.jpeg')) {
                $mime = 'image/jpeg';
            }
            $adminSigData = 'data:' . $mime . ';base64,' . base64_encode($rawContent);
        } elseif (!empty($options['admin_signature_data'])) {
            $adminSigData = $options['admin_signature_data'];
        }

        $signatoryName = $options['signatory_name'] ?? 'Authorized Signatory';
        $signatoryDesignation = $options['signatory_designation'] ?? 'Managing Director / HR Head';

        // Official letterhead background image
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
            'degree'                   => $application->degree ?? null,
            'position'                 => $position,
            'department'               => $department,
            'duration'                 => $duration,
            'stipend'                  => $stipend,
            'location'                 => $location,
            'mode'                     => $mode,
            'company_name'             => $companyName,
            'start_date'               => $startDate,
            'signed_at'                => $signedAt,
            'candidate_signature_data' => $candidateSigData,
            'admin_signature_data'     => $adminSigData,
            'signatory_name'           => $signatoryName,
            'signatory_designation'    => $signatoryDesignation,
            'letterhead_bg'            => $letterheadBg,
            'application_id'           => $application->id,
        ];

        // Render strictly 1-page PDF with DomPDF
        $pdf = Pdf::loadView('pdf.appointment_letter', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'defaultFont'          => 'Helvetica',
            ]);

        $fileName = 'BB-AL-' . date('Y') . '-' . str_pad((string)$application->id, 4, '0', STR_PAD_LEFT) . '-' . strtoupper(Str::random(4)) . '.pdf';
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

        // Create document record
        $record = AppointmentLetter::updateOrCreate(
            ['application_id' => $application->id],
            [
                'user_id'          => $application->user_id,
                'reference_number' => $referenceNumber,
                'file_path'        => $storageRelativePath,
                'document_version' => 'v2.0',
                'generated_by'     => $generatedBy,
                'generated_at'     => now(),
                'metadata'         => [
                    'position'              => $position,
                    'stipend'               => $stipend,
                    'duration'              => $duration,
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

// 2. Update appointment_letter.blade.php with strictly 1-page design & exact format
const templateCode = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
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
  }
  body {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 10px;
    line-height: 1.35;
    color: #111827;
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

  /* Document Body Content overlaid perfectly between header & footer */
  .content-wrapper {
    position: relative;
    z-index: 10;
    padding-top: 125px;
    padding-bottom: 75px;
    padding-left: 45px;
    padding-right: 45px;
  }

  .doc-title {
    text-align: center;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: #0d1b3e;
    margin-bottom: 8px;
  }

  .meta-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
    font-size: 9.5px;
  }

  .recipient-block {
    margin-bottom: 7px;
    font-size: 9.5px;
    line-height: 1.3;
  }

  .subject-line {
    font-size: 10.5px;
    font-weight: 800;
    color: #0d1b3e;
    margin-bottom: 7px;
  }

  p {
    margin-bottom: 5.5px;
    text-align: justify;
    font-size: 9.5px;
    line-height: 1.32;
  }

  ul.clauses-list {
    margin: 3px 0 6px 16px;
    padding: 0;
  }

  ul.clauses-list li {
    font-size: 9.5px;
    line-height: 1.3;
    margin-bottom: 2.5px;
  }

  .signatures-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
  }

  .sig-col {
    width: 50%;
    vertical-align: top;
  }

  .sig-img-container {
    height: 42px;
    margin: 2px 0;
  }

  .sig-img {
    max-height: 38px;
    max-width: 130px;
    display: block;
  }

  .sig-text-stamp {
    font-size: 10px;
    font-style: italic;
    color: #0d1b3e;
    font-weight: bold;
    padding-top: 10px;
  }

  .sig-line {
    border-top: 1px solid #374151;
    padding-top: 2px;
    font-size: 9px;
    line-height: 1.25;
  }

  .badge-signed {
    font-size: 8px;
    color: #059669;
    font-weight: 700;
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
    <strong style="font-size: 10.5px; color: #0d1b3e;">{{ $applicant_name }}</strong><br>
    @if(!empty($degree))<span>{{ $degree }}</span><br>@endif
    <span>{{ $location }}</span> | <span>{{ $applicant_email }}</span> | <span>{{ $applicant_phone }}</span>
  </div>

  <div class="subject-line">
    Subject: Appointment as {{ $position }}
  </div>

  <p>Dear <strong>{{ $applicant_name }}</strong>,</p>

  <p>
    We are pleased to appoint you as a <strong>{{ $position }}</strong> at <strong>{{ $company_name }}</strong>, effective <strong>{{ $start_date }}</strong>. You will report to the designated Team Lead / Project Manager.
  </p>

  <p>
    Your initial place of work will be <strong>{{ $location }}</strong> ({{ $mode }}), although transfers may occur as needed to meet business requirements. Working hours will follow company policy (e.g., <strong>9:30 AM to 6:30 PM, Monday to Friday</strong>).
  </p>

  <ul class="clauses-list">
    <li>Your gross stipend / compensation will be <strong>{{ $stipend }}</strong>, subject to applicable taxes and attendance.</li>
    <li>You will be on a <strong>{{ $duration }}</strong> probation / internship period, after which performance will be reviewed.</li>
    <li>You are entitled to paid leave and other benefits as outlined in company policy.</li>
  </ul>

  <p>
    This appointment may be terminated by either party with <strong>15 days</strong> written notice or payment instead of salary.
  </p>

  <p>
    Kindly sign and return a copy of this letter as confirmation of your acceptance. We welcome you aboard and wish you success in your new role.
  </p>

  <div style="font-size: 9.5px; font-weight: 700; margin-top: 4px; margin-bottom: 2px;">Warm regards,</div>

  <!-- Dual Signatures Side-by-Side Table -->
  <table class="signatures-table">
    <tr>
      <!-- Left: Admin Authorized Signatory -->
      <td class="sig-col" style="padding-right: 15px;">
        <div style="font-size: 9.5px; font-weight: 700; color: #0d1b3e;">
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
          <strong>{{ $signatory_name ?? 'Authorised Signatory' }}</strong><br>
          <span style="color: #4b5563;">{{ $signatory_designation ?? 'Managing Director / HR Head' }}</span><br>
          <span class="badge-signed">&#10003; Officially Authorized & Signed</span>
        </div>
      </td>

      <!-- Right: Candidate Acceptance -->
      <td class="sig-col" style="padding-left: 15px;">
        <div style="font-size: 9.5px; font-weight: 700; color: #0d1b3e;">
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

console.log('Successfully updated AppointmentLetterService.php and appointment_letter.blade.php');
