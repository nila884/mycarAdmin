<?php

namespace Database\Seeders;

use App\Models\Brand;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Car;// Ensure to import the VersionSeeder
use App\Models\carModel;
use App\Models\CarPrice;
use App\Models\Category;
use App\Models\EnginePower;
use App\Models\FuelType;
use App\Models\Image;
use App\Models\Seller;
use App\Models\User;
use App\Models\Version;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // $this->call([
        //     BrandSeeder::class,
        //     CategorySeeder::class,
        //     FuelTypeSeeder::class,
        //     SellerSeeder::class,
        //     CarModelSeeder::class,
        //     CarSeeder::class,
        //     CarPriceSeeder::class,
        //     ImageSeeder::class,
        //     VersionSeeder::class,
        // ]);

        // First, create the parent records and get their IDs.
        // This prevents the CarFactory from creating new dependencies for every car.
        $brands = Brand::factory(5)->create();
        $categories = Category::factory(5)->create();
        $fuelTypes = FuelType::factory(3)->create();
        $enginePowers = EnginePower::factory(10)->create();
        $sellers = Seller::factory(10)->create();

        // Create car models and assign them to a random brand.
        // $carModels = carModel::factory(20)->create([
        //     'brand_id' => $brands->random()->id,
        // ]);
        foreach ($brands as $brand) {
            // Create multiple car models for each brand.
            $carModels = carModel::factory(4)->create([
                'brand_id' => $brand->id,
            ]);
        }
        var_dump($carModels);
        foreach ($carModels as $carModel) {
            // Create multiple features for each car model.

            $versions = Version::factory(1)->create([
                'car_model_id' => $carModel->id,
            ]);
        }
        // Create versions and assign them to a random car model.
        // $versions = Version::factory(30)->create([
        //     'car_model_id' => $carModels->random()->id,
        // ]);
        $cars = Car::factory(50)->create([
            'car_model_id' => $carModels->random()->id,
            'category_id' => $categories->random()->id,
            'fuel_type_id' => $fuelTypes->random()->id,
            'seller_id' => $sellers->random()->id,
            'version_id' => $versions->random()->id, // Assign a random version ID
        ]);

        // Now, create records for the models that depend on cars.
        foreach ($cars as $car) {
            // Create a CarPrice record for each car.
            CarPrice::factory()->create([
                'car_id' => $car->id,
            ]);

            // Create multiple Image records for each car.
            Image::factory(3)->create([
                'car_id' => $car->id,
            ]);
        }

    }
}
