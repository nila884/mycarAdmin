<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Country>
 */
class CountryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'country_name' => $this->faker->unique()->country(),
            'code' => $this->faker->unique()->countryCode(), // e.g., "JP"
            'prefix' => $this->faker->numberBetween(1, 999), // e.g., "81"
            'currency' => $this->faker->currencyCode(), // e.g., "JPY"
            'import_regulation_information' => $this->faker->paragraphs(3, true),
            'flags' => 'flags/' . $this->faker->word() . '.png',
        ];
    }
}
