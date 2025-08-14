<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EnginePower;

class EnginePowerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         EnginePower::factory(10)->create();
    }
}
