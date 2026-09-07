<?php
require 'c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/vendor/autoload.php';

$files = glob('c:/Users/Lenovo/Documents/Downloads/backend_BB_fixed_v5/storage/app/appointment_letters/*.pdf');
usort($files, function($a, $b) { return filemtime($b) - filemtime($a); });

if (!empty($files)) {
    $latest = $files[0];
    echo "Latest PDF: " . basename($latest) . "\n";
    $content = file_get_contents($latest);
    $pageCount = preg_match_all("/\/Type\s*\/Page\b/", $content, $matches);
    echo "Total Pages in PDF: " . $pageCount . "\n";
} else {
    echo "No PDF found.\n";
}
