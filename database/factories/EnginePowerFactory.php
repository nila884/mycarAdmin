<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EnginePower;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EnginePower>
 */
class EnginePowerFactory extends Factory
{
      /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EnginePower::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'power' => $this->faker->unique()->numberBetween(50, 500) . ' HP',
        ];
    }
}
