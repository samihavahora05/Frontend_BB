$appointmentLetterBlade = @'
<!DOCTYPE html>
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
            padding-bottom: 95px;
        }

        /* ─── HEADER WITH BLUEBOXX DA BRANDING & GEOMETRIC POLYGONS ─── */
        .header-container {
            width: 100%;
            height: 115px;
            position: relative;
            background: #ffffff;
            border-bottom: 2px solid #0d1b3e;
        }
        .header-logo-box {
            position: absolute;
            top: 25px;
            left: 32px;
        }
        .brand-title {
            font-size: 28px;
            font-weight: 900;
            color: #0d1b3e;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            line-height: 1;
        }
        .brand-sub {
            font-size: 8.5px;
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
            width: 240px;
            height: 115px;
            overflow: hidden;
        }
        .poly-dark {
            position: absolute;
            top: 0;
            right: 0;
            width: 150px;
            height: 115px;
            background: #0d1b3e;
        }
        .poly-orange {
            position: absolute;
            top: 0;
            right: 0;
            width: 110px;
            height: 85px;
            background: #f57c00;
        }
        .poly-yellow {
            position: absolute;
            top: 0;
            right: 85px;
            width: 55px;
            height: 65px;
            background: #fbc02d;
        }

        /* ─── CONTENT AREA ─── */
        .content-wrap {
            padding: 24px 35px 20px 35px;
        }

        .meta-row {
            width: 100%;
            margin-bottom: 14px;
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
            margin: 6px 0 16px 0;
        }
        .doc-title {
            font-size: 15px;
            font-weight: 900;
            color: #0d1b3e;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 18px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            display: inline-block;
        }

        .to-block {
            margin-bottom: 12px;
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
            margin: 10px 0 12px 0;
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
            margin-bottom: 9px;
        }

        /* ─── BULLET TERMS ─── */
        .terms-bullets {
            margin: 6px 0 12px 18px;
            color: #334155;
            font-size: 11px;
        }
        .terms-bullets li {
            margin-bottom: 4.5px;
            line-height: 1.45;
        }

        /* ─── DUAL SIGNATURES TABLE ─── */
        .signature-table {
            width: 100%;
            margin-top: 18px;
            border-collapse: collapse;
        }
        .sig-col {
            width: 50%;
            vertical-align: top;
            padding: 0 8px;
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
'@

Set-Content -Path 'c:\Users\Lenovo\Documents\Downloads\backend_BB_fixed_v5\resources\views\pdf\appointment_letter.blade.php' -Value $appointmentLetterBlade -Encoding UTF8
Write-Host "1. Updated appointment_letter.blade.php"
