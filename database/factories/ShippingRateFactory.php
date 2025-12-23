<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingRate>
 */
class ShippingRateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => fake()->text(),
            'transport_mode' => fake()->text(),
            'from_country_id' => fake()->text(),
            'from_port_id' => fake()->text(),
            'to_country_id' => fake()->text(),
            'to_port_id' => fake()->text(),
            'price_roro' => fake()->text(),
            'price_container' => fake()->text(),
            'is_current' => fake()->text(),
            'created_at' => $this->faker->dateTime(),
            'updated_at' => $this->faker->dateTime(),
        ];
    }
}
