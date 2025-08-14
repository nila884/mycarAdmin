<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CarPrice;
use App\Models\Car;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CarPrice>
 */
class CarPriceFactory extends Factory
{
     /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = CarPrice::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'car_id' => Car::factory(),
            'price' => $this->faker->randomFloat(2, 5000, 100000),
            'discount' => $this->faker->optional()->randomFloat(2, 100, 5000),
            'discount_type' => $this->faker->optional()->randomElement(['amount','percent']),
            'is_current' => true,
        ];
    }
}
