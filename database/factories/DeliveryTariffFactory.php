<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Country;
use App\Models\DeliveryDriverAgency;
use App\Models\DeliveryTariff;
use App\Models\Port;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryTariffFactory extends Factory
{
    protected $model = DeliveryTariff::class;

    public function definition(): array
    {
        return [
            // Route Precision
            'from_country_id' => Country::factory(),
            'from_port_id' => Port::factory(),
            'from_city_id' => City::factory(),
            
            'country_id' => Country::factory(), // Destination
            'to_city_id' => City::factory(),
            'adress_name' => $this->faker->streetAddress(),

            // Service & Method Logic
            'service_type' => $this->faker->randomElement(['self_pickup', 'individual_driver', 'agency']),
            'delivery_method' => $this->faker->randomElement(['drive_away', 'car_carrier', 'container']),
            
            'delivery_driver_agency_id' => DeliveryDriverAgency::factory(),

            // Pricing
            'tarif_per_tone' => $this->faker->randomFloat(2, 50, 300),
            'driver_fee' => $this->faker->randomFloat(2, 20, 150),
            'clearing_fee' => $this->faker->randomFloat(2, 100, 500),
            'agency_service_fee' => $this->faker->randomFloat(2, 10, 100),
            
            'weight_range' => $this->faker->randomElement(['0-1500kg', '1501-2500kg', '2500kg+']),
            'is_current' => true,
        ];
    }
}