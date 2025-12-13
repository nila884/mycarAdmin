<?php

namespace Database\Seeders;

use App\Models\Brand;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Car; // Ensure to import the VersionSeeder
use App\Models\carModel;
use App\Models\CarPrice;
use App\Models\Category;
use App\Models\EnginePower;
use App\Models\Feature;
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

        $this->call([
            InitSeeder::class,
        ]);

        // create user
        $users = User::factory(20)->create();
        $i = 0;
        foreach ($users as $user) {
            if ($i < 10) {
                $user->assignRole('user');

            } elseif ($i < 17) {
                $user->assignRole('seller');
                Seller::factory()->create([
                    'seller_name' => $user->name,
                    'user_id' => $user->id,

                ]);
            } elseif ($i < 19) {
                $user->assignRole('admin');
            }
            $i++;
        }

        $imagesCars = collect([
            '/storage/cars/1765592641_693cce41e8bcd.jpg',
            '/storage/cars/1765592641_693cce41e8ef1.jpg',
            '/storage/cars/1765592641_693cce41e85ad.jpg',
            '/storage/cars/1765592641_693cce41e953a.jpg',
            '/storage/cars/1765592641_693cce41e8885.jpg',
            '/storage/cars/1765592641_693cce41e9206.jpg',
            '/storage/cars/1765592678_693cce6669d9e.jpg',
            '/storage/cars/1765592678_693cce666988d.jpg',
        ]);
        $logo = collect([
            '/storage/brand_logos/1765592745_ford.png',
            '/storage/brand_logos/1765592782_mazda.jpg',
        ]);

        $brands = Brand::factory(5)->create([
            'logo' => function (array $attributes) use ($logo) {
                return $logo->random();
            },
        ]);
        $categories = Category::factory(5)->create();
        $fuelTypes = FuelType::factory(3)->create();
        $enginePowers = EnginePower::factory(10)->create();
        $features = Feature::factory(20)->create();

        foreach ($brands as $brand) {

            $carModels = carModel::factory(4)->create([
                'brand_id' => $brand->id,
            ]);
        }

        foreach ($carModels as $carModel) {

            $versions = Version::factory(2)->create([
                'car_model_id' => $carModel->id,
            ]);
        }
        $carModelIds = CarModel::pluck('id');
        $versionIds = Version::pluck('id');
        $categoryIds = Category::pluck('id');
        $fuelTypesIds = FuelType::pluck('id');
        $sellerIds = Seller::pluck('id');
        $versionIds = Version::pluck('id');
        $cars = Car::factory(150)->create([
            'car_model_id' => function (array $attributes) use ($carModelIds) {
                return $carModelIds->random();
            },
            'category_id' => function (array $attributes) use ($categoryIds) {
                return $categoryIds->random();
            },
            'fuel_type_id' => function (array $attributes) use ($fuelTypesIds) {
                return $fuelTypesIds->random();
            },
            'seller_id' => function (array $attributes) use ($sellerIds) {
                return $sellerIds->random();
            },
            'version_id' => function (array $attributes) use ($versionIds) {
                return $versionIds->random();
            },
        ]);

        foreach ($cars as $car) {
            // Create a CarPrice record for each car.
            CarPrice::factory()->create([
                'car_id' => $car->id,
            ]);

            Image::factory(1)->create([
                'car_id' => $car->id,
                'image_path' => function (array $attributes) use ($imagesCars) {
                    return $imagesCars->random();
                },
                'is_main' => (true),
            ]);

            // Create multiple Image records for each car.
            Image::factory(6)->create([
                'car_id' => $car->id,
                'image_path' => function (array $attributes) use ($imagesCars) {
                    return $imagesCars->random();
                },
                'is_main' => (false),
            ]);

        }

    }
}
