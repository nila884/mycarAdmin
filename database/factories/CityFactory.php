<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

class CityFactory extends Factory
{
    protected $model = City::class;

    public function definition(): array
    {
        return [
            // Automatically creates a related Country record
            'country_id' => Country::factory(), 
            
            'name' => $this->faker->city(),
            'state_province' => $this->faker->state(),
            
            // Randomly sets some cities as hubs (logistics centers)
            'is_hub' => $this->faker->boolean(20), 
        ];
    }
}