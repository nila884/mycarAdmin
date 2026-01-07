<?php

namespace Database\Factories;

use App\Models\Port;
use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class PortFactory extends Factory
{
    protected $model = Port::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->city() . ' Port',
            // Generates a random 3-5 letter code like "TKO" or "LAX"
            'code' => strtoupper($this->faker->unique()->lexify('???')), 
            // This will automatically create a Country if one isn't provided
            'country_id' => Country::factory(),
        ];
    }
}