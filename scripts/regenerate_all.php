<?php
require 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/vendor/autoload.php';
$app = require_once 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\InternshipApplication;
use App\Services\AppointmentLetterService;

$service = new AppointmentLetterService();
$apps = InternshipApplication::with(['user', 'internship.company.companyProfile'])->get();

echo "Regenerating appointment letters for " . $apps->count() . " applications...\n";

foreach ($apps as $a) {
    echo "Processing application #" . $a->id . " (" . $a->applicant_name . ")...\n";
    $result = $service->generate($a, 1, [
        'signatory_name' => 'Authorized Signatory',
        'signatory_designation' => 'Director / HR Head',
    ]);
    echo " -> Reference: " . $result->reference_number . ", File: " . $result->file_path . "\n";
}

echo "ALL APPOINTMENT LETTERS REGENERATED SUCCESSFULLY!\n";
