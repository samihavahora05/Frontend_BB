<?php
require 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/vendor/autoload.php';
$app = require_once 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\InternshipApplication;
use Illuminate\Support\Facades\Storage;

$a = InternshipApplication::find(4);
if ($a) {
    echo "App #4: " . $a->applicant_name . "\n";
    echo "Signature Path: " . ($a->signature_path ?? 'NULL') . "\n";
    if (!empty($a->signature_path)) {
        echo "Exists on disk: " . (Storage::disk('local')->exists($a->signature_path) ? 'YES' : 'NO') . "\n";
    }
} else {
    echo "App #4 not found\n";
}
