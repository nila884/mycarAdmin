<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $adminEmail = env('SUPER_ADMIN_EMAIL');
        $adminPassword = env('SUPER_ADMIN_PASSWORD');
        $superAdminName = env('SUPER_ADMIN_NAME');
    
        $sa = User::create([
            'id' => 1,
            'name' => "administrator",
            'email' => "admin@test.com",
            'password' => bcrypt("password123"),
        ]);

        $sa->assignRole('admin');

    }
}
