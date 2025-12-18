<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\CarModel;
use App\Models\Category;
use App\Models\Feature;
use App\Models\FuelType;
use App\Models\Seller;
use App\Models\Version;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Car::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            // 'car_model_id' => carModel::factory(),
            // 'category_id' => Category::factory(),
            // 'fuel_type_id' => FuelType::factory(),
            // 'version_id' => Version::factory(),
            // 'seller_id' => Seller::factory(),
            'mileage' => $this->faker->numberBetween(1000, 200000),
            'chassis_number' => $this->faker->unique()->ean13(),
            'registration_year' => $this->faker->year(),
            'manufacture_year' => $this->faker->year(),
            'weight' => $this->faker->numberBetween(1000, 3000),
            'status' => $this->faker->randomElement(['0', '1']),
            'transmission' => $this->faker->randomElement(['automatic', 'manual']),
            'publication_status' => $this->faker->randomElement(['published', 'pending', 'archived']),
            'car_selling_status' => $this->faker->randomElement(['sold', 'selling', 'reserved']),
            'steering' => $this->faker->randomElement(['left', 'right']),
            'seating_capacity' => $this->faker->numberBetween(2, 7),
            'engine_code' => $this->faker->unique()->bothify('??###??##'),
            'engine_size' => $this->faker->randomFloat(1, 1.0, 5.0),
            'model_code' => $this->faker->unique()->bothify('??###??##'),
            'wheel_driver' => $this->faker->randomElement(['awd', 'fwd', 'rwd']),
            'm_3' => $this->faker->randomFloat(2, 1.5, 4.0),
            'doors' => $this->faker->randomElement([2, 3, 4, 5]),
            'location' => $this->faker->city(),
            'dimensions' => $dimensions = [
                'length_mm' => $this->faker->numberBetween(3500, 5500),
                'width_mm' => $this->faker->numberBetween(1600, 2000),
                'height_mm' => $this->faker->numberBetween(1400, 1800),
            ],
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Car $car) {

            $featureIds = Feature::pluck('id');

            $randomFeatures = $featureIds->shuffle()->take(rand(3, 7));

            $car->features()->attach($randomFeatures);
        });
    }
}
