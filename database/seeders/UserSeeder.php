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
        // super admin
        $sa = User::create([
            'id' => 1,
            'name' => 'Super Admin',
            'email' => 'super@admin.com',
            'password' => bcrypt('password'),
        ]);
        $sa->assignRole('super-admin');

        // admin
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@mail.com',
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('admin');

        // partner
        $partner = User::create([
            'name' => 'Agence',
            'email' => 'agence@mail.com',
            'password' => bcrypt('password'),
        ]);
        $partner->assignRole('agence');

        // normal user
        $user = User::create([
            'name' => 'User',
            'email' => 'user@mail.com',
            'password' => bcrypt('password'),
        ]);
        $user->assignRole('user');
    }
}
