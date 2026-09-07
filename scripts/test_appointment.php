<?php
require 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/vendor/autoload.php';
$app = require_once 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

require_once 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/app/Services/AppointmentLetterService.php';

use App\Models\InternshipApplication;
use App\Services\AppointmentLetterService;

$service = new AppointmentLetterService();
$appRecord = InternshipApplication::first();
if ($appRecord) {
    echo "Testing generation for application #" . $appRecord->id . "\n";
    $result = $service->generate($appRecord, 1, [
        'signatory_name' => 'Authorized Signatory',
        'signatory_designation' => 'Managing Director',
    ]);
    echo "Generated PDF reference: " . $result->reference_number . "\n";
    echo "Path: " . $result->file_path . "\n";
    echo "SUCCESS!\n";
} else {
    echo "No application found to test\n";
}
