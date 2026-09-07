$controllerPath = 'c:\Users\Lenovo\Documents\Downloads\backend_BB_fixed_v5\app\Http\Controllers\Api\Admin\AdminInternshipController.php'
$code = Get-Content -Path $controllerPath -Raw -Encoding UTF8

$newMethod = @'
    /**
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
            if (preg_match('/^data:image\/(\w+);base64,/', $sigData, $type)) {
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
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning('Applicant approval email notification failed: ' . $e->getMessage());
        }

        $application->load(['appointmentLetter', 'reviewer']);

        return response()->json([
            'success' => true,
            'message' => 'Application approved and Appointment Letter with dual signatures generated successfully!',
            'data'    => $application,
        ]);
    }
'@

$pattern = '(?s)/\*\*.*?\* Approve an application.*?\*/\s*public function approveApplication\(Request \$request, \$id\).*?return response\(\)->json\(\[.*?\]\);\s*\}'
$updatedCode = [regex]::Replace($code, $pattern, $newMethod)

Set-Content -Path $controllerPath -Value $updatedCode -Encoding UTF8
Write-Host "3. Updated AdminInternshipController.php"
