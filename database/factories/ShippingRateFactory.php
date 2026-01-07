<?php

namespace Database\Factories;

use App\Models\Country;
use App\Models\Port;
use App\Models\ShippingRate;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShippingRateFactory extends Factory
{
    protected $model = ShippingRate::class;

    public function definition(): array
    {
        return [
            'transport_mode' => $this->faker->randomElement(['sea', 'land']),
            
            // Link to Country and Port factories
            'from_country_id' => Country::factory(),
            'from_port_id' => Port::factory(),
            'to_country_id' => Country::factory(),
            'to_port_id' => Port::factory(),
            
            'price_roro' => $this->faker->randomFloat(2, 500, 3000),
            'price_container' => $this->faker->randomFloat(2, 1200, 5000),
            
            // Explicitly set as a boolean to avoid SQLite datatype mismatch
            'is_current' => true, 
        ];
    }
}