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
           'category_id' => \App\Models\Category::inRandomOrder()->first()?->id ?? \App\Models\Category::factory(),
        'fuel_type_id' => \App\Models\FuelType::inRandomOrder()->first()?->id ?? \App\Models\FuelType::factory(),
        'version_id' => \App\Models\Version::inRandomOrder()->first()?->id ?? \App\Models\Version::factory(),
        'seller_id' => \App\Models\Seller::inRandomOrder()->first()?->id ?? \App\Models\Seller::factory(),
        'origin_country_id' => \App\Models\Country::inRandomOrder()->first()?->id ?? \App\Models\Country::factory(),
        
        'mileage' => $this->faker->numberBetween(1000, 200000),
        'chassis_number' => $this->faker->unique()->ean13(),
        'weight' => $this->faker->numberBetween(1000, 3000),
        'transmission' => $this->faker->randomElement(['automatic', 'manual']),
        'steering' => $this->faker->randomElement(['right', 'left']),
        'publication_status' => 'published',
        'car_selling_status' => 'selling',
        'cost_price' => $this->faker->randomFloat(2, 5000, 6000),        
        'min_profit_margin' => $this->faker->randomFloat(2, 100, 200),
        'seating_capacity' => 5,
        'manufacture_year'=> $this->faker->year(max:'now'),
        'doors' => 4,
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

            $featureIds = Feature::where('is_main', true)->pluck('id');

            $randomFeatures = $featureIds->shuffle()->take(rand(3, 7));

            $car->features()->attach($randomFeatures);
            
        });
    }
}
