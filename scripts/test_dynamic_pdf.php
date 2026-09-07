<?php
require 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/vendor/autoload.php';
$app = require_once 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\InternshipApplication;
use App\Services\AppointmentLetterService;

$service = new AppointmentLetterService();
$appRecord = InternshipApplication::find(4); // Diya Parmar
if ($appRecord) {
    echo "Testing generation for application #4 (" . $appRecord->applicant_name . ")...\n";
    $result = $service->generate($appRecord, 1, [
        'designation'           => 'Backend Developer Intern',
        'department'            => 'Engineering & Development',
        'start_date'            => '2026-09-15',
        'end_date'              => '2027-03-15',
        'duration'              => '6 Months',
        'working_days'          => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'working_hours'         => '09:30 AM - 06:30 PM',
        'break_time'            => '01:00 PM - 02:00 PM',
        'stipend_amount'        => 18000,
        'stipend_currency'      => '₹',
        'payment_frequency'     => 'month',
        'reporting_to'          => 'Technical Project Manager',
        'reporting_person_name' => 'Karan Dave',
        'work_location'         => 'Vadodara, Gujarat',
        'work_mode'             => 'Onsite',
        'issue_date'            => '2026-09-07',
        'signatory_name'        => 'Authorized Signatory',
        'signatory_designation' => 'Director / HR Head',
    ]);
    echo "Generated Reference: " . $result->reference_number . "\n";
    echo "File Path: " . $result->file_path . "\n";
    echo "Metadata: " . json_encode($result->metadata) . "\n";
    echo "SUCCESS!\n";
} else {
    echo "Application #4 not found\n";
}
