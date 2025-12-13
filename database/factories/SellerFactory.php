<?php

namespace Database\Factories;

use App\Models\Seller;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Seller>
 */
class SellerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Seller::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [

            'phone' => $this->faker->phoneNumber(),
            'description' => $this->faker->paragraph(),
            'address' => $this->faker->address(),
            'country' => $this->faker->country(),
            'avatar' => 'public/storage/cars/avatar.webp',
        ];
    }
}
