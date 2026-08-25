<?php

require __DIR__ . '/../backend_BB_fixed_v5/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend_BB_fixed_v5/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

if (!Schema::hasTable('student_job_offers')) {
    Schema::create('student_job_offers', function ($table) {
        $table->id();
        $table->string('student_name');
        $table->string('degree')->nullable();
        $table->string('company_name')->nullable();
        $table->string('role');
        $table->string('offered_on')->nullable();
        $table->string('package')->nullable();
        $table->string('avatar_url')->nullable();
        $table->string('image_url')->nullable();
        $table->boolean('is_active')->default(true);
        $table->integer('display_order')->default(0);
        $table->timestamps();
    });
} else {
    Schema::table('student_job_offers', function ($table) {
        if (!Schema::hasColumn('student_job_offers', 'image_url')) {
            $table->string('image_url')->nullable()->after('avatar_url');
        }
        if (!Schema::hasColumn('student_job_offers', 'display_order')) {
            $table->integer('display_order')->default(0)->after('is_active');
        }
    });
}

DB::table('student_job_offers')->truncate();

$students = [
    [
        'student_name' => 'Yuvraj Parmar',
        'role'         => 'Graphic design',
        'company_name' => 'Blueboxx Media',
        'image_url'    => '/students/yuvraj_parmar.png',
        'avatar_url'   => '/students/yuvraj_parmar.png',
        'display_order'=> 1,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Vikas',
        'role'         => 'Graphic design',
        'company_name' => 'Creative Labs',
        'image_url'    => '/students/vikas.png',
        'avatar_url'   => '/students/vikas.png',
        'display_order'=> 2,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Vaidehi',
        'role'         => 'Graphic design, digital marketing',
        'company_name' => 'Digital Spark',
        'image_url'    => '/students/vaidehi.png',
        'avatar_url'   => '/students/vaidehi.png',
        'display_order'=> 3,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Tushar',
        'role'         => 'Graphic design',
        'company_name' => 'Studio 9',
        'image_url'    => '/students/tushar.png',
        'avatar_url'   => '/students/tushar.png',
        'display_order'=> 4,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Tisha Padhiyar',
        'role'         => 'web development',
        'company_name' => 'TechNova Solutions',
        'image_url'    => '/students/tisha_padhiyar.png',
        'avatar_url'   => '/students/tisha_padhiyar.png',
        'display_order'=> 5,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Tax Patel',
        'role'         => 'Digital Marketing',
        'company_name' => 'Growth Media',
        'image_url'    => '/students/tax_patel.png',
        'avatar_url'   => '/students/tax_patel.png',
        'display_order'=> 6,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Swapnesh',
        'role'         => 'web development',
        'company_name' => 'Cognizant',
        'image_url'    => '/students/swapnesh.png',
        'avatar_url'   => '/students/swapnesh.png',
        'display_order'=> 7,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Suhani Dhuri',
        'role'         => 'web development',
        'company_name' => 'Infosys',
        'image_url'    => '/students/suhani_dhuri.png',
        'avatar_url'   => '/students/suhani_dhuri.png',
        'display_order'=> 8,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Shruti Jadhav',
        'role'         => 'Graphic design',
        'company_name' => 'DesignHub',
        'image_url'    => '/students/shruti_jadhav.png',
        'avatar_url'   => '/students/shruti_jadhav.png',
        'display_order'=> 9,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Shivam',
        'role'         => 'Graphic design',
        'company_name' => 'Pixel Studio',
        'image_url'    => '/students/shivam.png',
        'avatar_url'   => '/students/shivam.png',
        'display_order'=> 10,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Samuel Gabi',
        'role'         => 'Graphic design, digital marketing',
        'company_name' => 'Global Matrix',
        'image_url'    => '/students/samuel_gabi.png',
        'avatar_url'   => '/students/samuel_gabi.png',
        'display_order'=> 11,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Rehan Bavla',
        'role'         => 'Graphic design',
        'company_name' => 'Design Studio',
        'image_url'    => '/students/rehan_bavla.png',
        'avatar_url'   => '/students/rehan_bavla.png',
        'display_order'=> 12,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Priyal Chauhan',
        'role'         => 'web development',
        'company_name' => 'WebTech Corp',
        'image_url'    => '/students/priyal_chauhan.png',
        'avatar_url'   => '/students/priyal_chauhan.png',
        'display_order'=> 13,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Prem',
        'role'         => 'Graphic design, digital marketing',
        'company_name' => 'Media Matrix',
        'image_url'    => '/students/prem.png',
        'avatar_url'   => '/students/prem.png',
        'display_order'=> 14,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
    [
        'student_name' => 'Pratik Sirsath',
        'role'         => 'Graphic design, digital marketing',
        'company_name' => 'Digital Spark',
        'image_url'    => '/students/pratik_sirsath.png',
        'avatar_url'   => '/students/pratik_sirsath.png',
        'display_order'=> 15,
        'is_active'    => true,
        'created_at'   => now(),
        'updated_at'   => now(),
    ],
];

DB::table('student_job_offers')->insert($students);
echo "SUCCESS: Stored " . DB::table('student_job_offers')->count() . " student records into database table student_job_offers\n";
