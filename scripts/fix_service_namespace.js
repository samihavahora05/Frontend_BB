import fs from 'fs';
import path from 'path';

const backend = 'c:\\Users\\Lenovo\\Documents\\Downloads\\backend_BB_fixed_v5';

const serviceContent = `<?php

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

fs.writeFileSync(path.join(backend, 'app', 'Services', 'AppointmentLetterService.php'), serviceContent);
console.log('Fixed AppointmentLetterService.php with proper namespace backslashes.');
