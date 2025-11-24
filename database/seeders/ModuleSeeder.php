<?php

namespace Database\Seeders;

use App\Models\Module;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Module::create(['name' => 'car']);
        Module::create(['name' => 'user']);
        Module::create(['name' => 'invoice']);
        Module::create(['name' => 'settings']);
    }
}
