const fs = require('fs');
const path = require('path');

const backendDir = 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5';

// 1. Update resources/views/pdf/appointment_letter.blade.php
const appointmentLetterBlade = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Appointment Letter - {{ $applicant_name }}</title>
    <style>
        @page {
            margin: 0mm;
            size: a4 portrait;
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1a202c;
            line-height: 1.55;
            font-size: 11.5px;
            background: #ffffff;
            position: relative;
            padding-bottom: 90px;
        }

        /* ─── HEADER WITH BLUEBOXX DA BRANDING & POLYGONS ─── */
        .header-container {
            width: 100%;
            height: 110px;
            position: relative;
            background: #ffffff;
            border-bottom: 2px solid #0d1b3e;
        }
        .header-logo-box {
            position: absolute;
            top: 22px;
            left: 30px;
        }
        .brand-title {
            font-size: 26px;
            font-weight: 900;
            color: #0d1b3e;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1;
        }
        .brand-sub {
            font-size: 8px;
            font-weight: 700;
            color: #4a5568;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 5px;
        }
        .header-polygon-wrap {
            position: absolute;
            top: 0;
            right: 0;
            width: 220px;
            height: 110px;
            overflow: hidden;
        }
        .poly-dark {
            position: absolute;
            top: 0;
            right: 0;
            width: 140px;
            height: 110px;
            background: #0d1b3e;
        }
        .poly-orange {
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 80px;
            background: #f57c00;
        }
        .poly-yellow {
            position: absolute;
            top: 0;
            right: 75px;
            width: 50px;
            height: 60px;
            background: #fbc02d;
        }

        /* ─── CONTENT AREA ─── */
        .content-wrap {
            padding: 24px 32px 20px 32px;
        }

        .meta-row {
            width: 100%;
            margin-bottom: 16px;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
        }
        .meta-table td {
            font-size: 11px;
            color: #4a5568;
        }
        .meta-right {
            text-align: right;
            font-weight: bold;
            color: #0d1b3e;
        }

        .doc-title-box {
            text-align: center;
            margin: 10px 0 16px 0;
        }
        .doc-title {
            font-size: 15px;
            font-weight: 900;
            color: #0d1b3e;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 16px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            display: inline-block;
        }

        .to-block {
            margin-bottom: 14px;
            font-size: 11.5px;
            line-height: 1.45;
            color: #2d3748;
        }
        .to-block .name {
            font-size: 13px;
            font-weight: 800;
            color: #0d1b3e;
        }

        .subject-box {
            margin: 12px 0 14px 0;
            font-size: 12px;
            font-weight: 800;
            color: #0d1b3e;
            padding: 6px 12px;
            background: #eff6ff;
            border-left: 3px solid #1b2a6b;
            border-radius: 4px;
        }

        .letter-body {
            font-size: 11.5px;
            color: #2d3748;
            line-height: 1.55;
            margin-bottom: 12px;
        }
        .letter-body p {
            margin-bottom: 10px;
        }

        /* ─── BULLET TERMS ─── */
        .terms-bullets {
            margin: 8px 0 14px 18px;
            color: #334155;
            font-size: 11px;
        }
        .terms-bullets li {
            margin-bottom: 5px;
            line-height: 1.45;
        }

        /* ─── DUAL SIGNATURES TABLE ─── */
        .signature-table {
            width: 100%;
            margin-top: 22px;
            border-collapse: collapse;
        }
        .sig-col {
            width: 50%;
            vertical-align: top;
            padding: 0 10px;
        }
        .sig-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            min-height: 115px;
        }
        .sig-title {
            font-size: 10.5px;
            font-weight: 800;
            color: #0d1b3e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px dashed #cbd5e1;
            padding-bottom: 4px;
            margin-bottom: 6px;
        }
        .sig-img-wrap {
            height: 48px;
            display: block;
            margin: 4px 0;
        }
        .sig-img {
            max-height: 48px;
            max-width: 140px;
            object-fit: contain;
        }
        .sig-signer-name {
            font-size: 11.5px;
            font-weight: 800;
            color: #0d1b3e;
        }
        .sig-signer-role {
            font-size: 9.5px;
            font-weight: 600;
            color: #64748b;
        }
        .sig-verified-tag {
            font-size: 8.5px;
            font-weight: 700;
            color: #16a34a;
            margin-top: 2px;
        }

        /* ─── OFFICIAL FOOTER WITH ADDRESS BANNER ─── */
        .footer-wrap {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            background: #ffffff;
        }
        .contact-pill-row {
            background: #ffffff;
            padding: 6px 30px;
            text-align: center;
            font-size: 9.5px;
            font-weight: bold;
            color: #1e293b;
            border-top: 1px solid #f1f5f9;
        }
        .contact-item {
            display: inline-block;
            margin: 0 14px;
        }
        .contact-item span.icon {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
            color: #ffffff;
            font-size: 8px;
            margin-right: 4px;
            vertical-align: middle;
        }
        .icon-phone { background: #f57c00; }
        .icon-email { background: #0d1b3e; }
        .icon-web { background: #fbc02d; color: #0d1b3e !important; }

        .address-strip {
            background: #fbc02d;
            color: #0d1b3e;
            text-align: center;
            font-size: 9.5px;
            font-weight: 900;
            padding: 8px 15px;
            letter-spacing: 0.3px;
            border-top: 1px solid #eab308;
        }
    </style>
</head>
<body>

    <!-- ─── HEADER BRANDING ─── -->
    <div class="header-container">
        <div class="header-logo-box">
            <div class="brand-title">BLUEBOXX DA</div>
            <div class="brand-sub">ADVERTISING | TRAINING | PLACEMENT | ANIMATION</div>
        </div>
        <div class="header-polygon-wrap">
            <div class="poly-dark"></div>
            <div class="poly-orange"></div>
            <div class="poly-yellow"></div>
        </div>
    </div>

    <!-- ─── CONTENT BODY ─── -->
    <div class="content-wrap">

        <div class="meta-row">
            <table class="meta-table">
                <tr>
                    <td><strong>Ref:</strong> {{ $reference_number }}</td>
                    <td class="meta-right"><strong>Date:</strong> {{ $issue_date }}</td>
                </tr>
            </table>
        </div>

        <div class="doc-title-box">
            <div class="doc-title">Appointment Letter</div>
        </div>

        <div class="to-block">
            <div>To,</div>
            <div class="name">{{ $applicant_name }}</div>
            @if(!empty($degree))
                <div>{{ $degree }}</div>
            @endif
            @if(!empty($location))
                <div>{{ $location }}</div>
            @endif
            <div>Email: {{ $applicant_email }} | Contact: {{ $applicant_phone }}</div>
        </div>

        <div class="subject-box">
            Subject: Appointment as {{ $position }}
        </div>

        <div class="letter-body">
            <p>Dear <strong>{{ $applicant_name }}</strong>,</p>

            <p>
                We are pleased to appoint you as a <strong>{{ $position }}</strong> at <strong>{{ $company_name }}</strong>, 
                effective <strong>{{ $start_date }}</strong>, on a <strong>{{ $mode }}</strong> engagement basis. 
                You will report to <strong>{{ $reporting_to ?? 'Program Technical Lead / Assigned Mentor' }}</strong>.
            </p>

            <p>
                Your initial place of engagement will be <strong>{{ $location }}</strong>, although transfers or remote adaptations may occur as needed to meet business and training requirements. Working hours will follow company policy (e.g., 9:30 AM to 6:30 PM, Monday to Friday / Flexible schedule for academic project deliverables).
            </p>

            <ul class="terms-bullets">
                <li>Your monthly stipend will be <strong>{{ $stipend }}</strong>, subject to applicable milestone delivery.</li>
                <li>You will be on a <strong>{{ $duration }}</strong> engagement period, after which performance and project contribution will be formally reviewed.</li>
                <li>You are entitled to industry mentorship, live project repository access, and official experience certification upon successful completion.</li>
                <li>This appointment may be terminated by either party with 15 days written notice or performance review.</li>
            </ul>

            <p>
                Kindly sign and return a copy of this letter as confirmation of your acceptance. We welcome you aboard and wish you success in your new role.
            </p>

            <p style="margin-top: 8px;">
                Warm regards,
            </p>
        </div>

        <!-- ─── DUAL SIGNATURES (SIDE BY SIDE) ─── -->
        <table class="signature-table">
            <tr>
                <!-- LEFT: AUTHORIZED SIGNATORY (ADMIN / COMPANY) -->
                <td class="sig-col">
                    <div class="sig-box">
                        <div class="sig-title">For {{ $company_name }}</div>
                        <div class="sig-img-wrap">
                            @if(!empty($admin_signature_data))
                                <img src="{{ $admin_signature_data }}" class="sig-img" alt="Admin Signature" />
                            @else
                                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #0d1b3e; padding-top: 10px;">
                                    {{ $signatory_name ?? 'Blueboxx DA Authority' }}
                                </div>
                            @endif
                        </div>
                        <div class="sig-signer-name">{{ $signatory_name ?? 'Authorized Signatory' }}</div>
                        <div class="sig-signer-role">{{ $signatory_designation ?? 'Managing Director / HR Head' }}</div>
                        <div class="sig-verified-tag">✓ Officially Authorized & Signed</div>
                    </div>
                </td>

                <!-- RIGHT: CANDIDATE ACCEPTANCE -->
                <td class="sig-col">
                    <div class="sig-box">
                        <div class="sig-title">Candidate Acceptance & Signature</div>
                        <div class="sig-img-wrap">
                            @if(!empty($candidate_signature_data))
                                <img src="{{ $candidate_signature_data }}" class="sig-img" alt="Candidate Signature" />
                            @else
                                <div style="font-family: 'Brush Script MT', cursive, sans-serif; font-size: 18px; color: #1e293b; padding-top: 10px;">
                                    {{ $applicant_name }}
                                </div>
                            @endif
                        </div>
                        <div class="sig-signer-name">{{ $applicant_name }}</div>
                        <div class="sig-signer-role">Candidate / Trainee</div>
                        <div class="sig-verified-tag">✓ Digitally Signed & Accepted on {{ $signed_at ?? $issue_date }}</div>
                    </div>
                </td>
            </tr>
        </table>

    </div>

    <!-- ─── OFFICIAL FOOTER ─── -->
    <div class="footer-wrap">
        <div class="contact-pill-row">
            <div class="contact-item">
                <span class="icon icon-phone">☎</span> +91-7798575777
            </div>
            <div class="contact-item">
                <span class="icon icon-email">✉</span> info.blueboxx@gmail.com
            </div>
            <div class="contact-item">
                <span class="icon icon-web">🌐</span> www.blueboxx.in
            </div>
        </div>
        <div class="address-strip">
            SF-02, Indiabulls, Mega Mall Nr. Jetalpur, Bridge, Akota Road, Akota, Vadodara
        </div>
    </div>

</body>
</html>
`;

fs.writeFileSync(path.join(backendDir, 'resources/views/pdf/appointment_letter.blade.php'), appointmentLetterBlade, 'utf8');
console.log('1. Created appointment_letter.blade.php');

// 2. Update app/Services/AppointmentLetterService.php
const appointmentLetterService = `<?php

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
        $duration = $application->internship?->duration ?? ($application->internship?->duration_months ? $application->internship->duration_months . ' Months' : '3-6 Months');
        $stipend = $application->internship?->stipend > 0 ? ('₹' . number_format($application->internship->stipend) . ' per month') : 'Performance Based';
        $location = $application->internship?->location ?? 'Vadodara, Gujarat';
        $mode = $application->internship?->mode ?? 'Remote';
        $companyName = 'BLUEBOXX DA PVT. LTD.';
        $startDate = $application->internship?->start_date ? \\Carbon\\Carbon::parse($application->internship->start_date)->format('d/m/Y') : now()->addDays(7)->format('d/m/Y');
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
            'application_id'           => $application->id,
        ];

        // Render PDF with DomPDF
        $pdf = Pdf::loadView('pdf.appointment_letter', $data)
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => true,
                'defaultFont'          => 'sans-serif',
            ]);

        $fileName = 'appointment_letters/' . $referenceNumber . '.pdf';
        Storage::disk('local')->put($fileName, $pdf->output());

        $letter = AppointmentLetter::updateOrCreate(
            ['application_id' => $application->id],
            [
                'user_id'          => $application->user_id,
                'reference_number' => $referenceNumber,
                'file_path'        => $fileName,
                'document_version' => 'v1.0',
                'generated_by'     => $generatedBy ?? auth()->id(),
                'generated_at'     => now(),
                'metadata'         => array_merge($data, [
                    'candidate_signature_data' => null, // Don't persist large base64 in metadata
                    'admin_signature_data'     => null,
                ]),
            ]
        );

        // Update application
        $application->update([
            'appointment_letter_path'         => $fileName,
            'appointment_letter_generated_at' => now(),
        ]);

        // Audit log
        AuditLog::create([
            'user_id'    => $generatedBy ?? auth()->id(),
            'action'     => 'appointment_letter_generated',
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => request()->userAgent() ?? 'System',
            'payload'    => [
                'application_id'   => $application->id,
                'reference_number' => $referenceNumber,
                'applicant'        => $applicantName,
                'signatory'        => $signatoryName,
            ],
        ]);

        return $letter;
    }

    /**
     * Get or generate the official Terms and Conditions PDF document
     */
    public function getTermsAndConditionsPdf(): string
    {
        $path = 'documents/terms_and_conditions.pdf';
        if (!Storage::disk('local')->exists($path)) {
            $pdf = Pdf::loadView('pdf.terms_and_conditions', [
                'version'      => 'v1.0',
                'updated_date' => date('d/m/Y'),
                'company_name' => 'BLUEBOXX DA PVT. LTD.',
            ])->setPaper('a4', 'portrait');

            Storage::disk('local')->put($path, $pdf->output());
        }

        return Storage::disk('local')->path($path);
    }
}
`;

fs.writeFileSync(path.join(backendDir, 'app/Services/AppointmentLetterService.php'), appointmentLetterService, 'utf8');
console.log('2. Created AppointmentLetterService.php');

// 3. Update app/Http/Controllers/Api/Admin/AdminInternshipController.php
const adminControllerPath = path.join(backendDir, 'app/Http/Controllers/Api/Admin/AdminInternshipController.php');
let adminControllerCode = fs.readFileSync(adminControllerPath, 'utf8');

// Replace approveApplication method
const newApproveMethod = `    /**
     * Approve an application, generate appointment letter atomically with dual signatures, and notify applicant
     * POST /api/admin/internships/applications/{id}/approve
     */
    public function approveApplication(Request $request, $id)
    {
        $adminSigPath = null;
        if ($request->hasFile('admin_signature')) {
            $file = $request->file('admin_signature');
            $adminSigPath = $file->storeAs('signatures', 'admin_sig_' . time() . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension(), 'local');
        } elseif ($request->filled('admin_signature') && str_starts_with($request->input('admin_signature'), 'data:image')) {
            $sigData = $request->input('admin_signature');
            if (preg_match('/^data:image\\/(\\w+);base64,/', $sigData, $type)) {
                $data = base64_decode(substr($sigData, strpos($sigData, ',') + 1));
                $ext = in_array(strtolower($type[1]), ['jpg', 'jpeg', 'png', 'webp']) ? strtolower($type[1]) : 'png';
                $filename = 'signatures/admin_sig_' . time() . '_' . Str::random(10) . '.' . $ext;
                Storage::disk('local')->put($filename, $data);
                $adminSigPath = $filename;
            }
        }

        $signatoryName = $request->input('signatory_name') ?: (auth()->user()?->name ?: 'Authorized Signatory');
        $signatoryDesignation = $request->input('signatory_designation') ?: 'Managing Director / HR Head';

        $options = [
            'signatory_name'        => $signatoryName,
            'signatory_designation' => $signatoryDesignation,
            'admin_signature_path'  => $adminSigPath,
        ];

        $application = DB::transaction(function () use ($id, $request, $options) {
            $app = InternshipApplication::lockForUpdate()->findOrFail($id);

            $app->update([
                'status'      => 'approved',
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
                'approved_at' => now(),
            ]);

            // Generate appointment letter with dual signatures
            $this->appointmentService->generate($app, auth()->id(), $options);

            // Audit log
            AuditLog::create([
                'user_id'    => auth()->id(),
                'action'     => 'internship_application_approved',
                'ip_address' => $request->ip() ?? '127.0.0.1',
                'user_agent' => $request->userAgent() ?? 'System',
                'payload'    => [
                    'application_id' => $app->id,
                    'applicant'      => $app->applicant_name,
                    'signatory'      => $options['signatory_name'],
                ],
            ]);

            return $app;
        });

        // Email Notification to Applicant (try/catch to protect response)
        try {
            if (!empty($application->applicant_email) && filter_var($application->applicant_email, FILTER_VALIDATE_EMAIL)) {
                Mail::to($application->applicant_email)->send(new InternshipApprovalMail($application));
            }
        } catch (\\Throwable $e) {
            \\Illuminate\\Support\\Facades\\Log::warning('Applicant approval email notification failed: ' . $e->getMessage());
        }

        $application->load(['appointmentLetter', 'reviewer']);

        return response()->json([
            'success' => true,
            'message' => 'Application approved and Appointment Letter with dual signatures generated successfully!',
            'data'    => $application,
        ]);
    }`;

adminControllerCode = adminControllerCode.replace(
    /\/\*\*[\s\S]*?public function approveApplication\(Request \$request, \$id\)[\s\S]*?return response\(\)->json\(\[[\s\S]*?\}\);[\s\S]*?\}/,
    newApproveMethod
);

fs.writeFileSync(adminControllerPath, adminControllerCode, 'utf8');
console.log('3. Updated AdminInternshipController.php');
