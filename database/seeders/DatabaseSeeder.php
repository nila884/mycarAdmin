<?php

namespace Database\Seeders;

use App\Models\Brand;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Car; // Ensure to import the VersionSeeder
use App\Models\CarModel;
use App\Models\CarPrice;
use App\Models\Category;
use App\Models\Color;
use App\Models\Country;
use App\Models\EnginePower;
use App\Models\Feature;
use App\Models\FuelType;
use App\Models\Image;
use App\Models\Port;
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
            ShippingLogisticSeeder::class,
            FeaturesSeeder::class,
        ]);
        $imagesCars = collect([
'cars/1765592641_693cce41e85ad.jpg',
'cars/1765592641_693cce41e953a.jpg',
'cars/1765592641_693cce41e8885.jpg',
'cars/1765592641_693cce41e9206.jpg',
'cars/1765592678_693cce666988d.jpg',
'cars/1765931485_6941f9dd04c1c.jpeg',
'cars/1765931485_6941f9dd03432.jpeg',
'cars/1765931485_6941f9dd04292.jpeg',
'cars/1765931485_6941f9dd04590.jpeg',
'cars/1765931485_6941f9dd04912.jpeg',
'cars/1755117889_689cf94123792.jpg',


        ]);
        $logo = collect([
            'brand_logos/1765592745_ford.png',
            'brand_logos/1765592782_mazda.jpg',
        ]);

        $brands = Brand::factory(5)->create([
            'logo' => function (array $attributes) use ($logo) {
                return $logo->random();
            },
        ]);
        Category::factory(5)->create();
       FuelType::factory(3)->create();
        EnginePower::factory(10)->create();
       
        $colors= Color::factory(5)->create();
        foreach ($brands as $brand) {

            CarModel::factory(4)->create([
                'brand_id' => $brand->id,
            ]);
        }
        $carModelIds = CarModel::pluck('id');
        foreach ($carModelIds as $id) {

            Version::factory(3)->create([
                'car_model_id' => $id,
            ]);
        }

        $versionIds = Version::pluck('id');
        $categoryIds = Category::pluck('id');
        $fuelTypesIds = FuelType::pluck('id');
        $sellerIds = Seller::pluck('id');
        $versionIds = Version::pluck('id');
        $colorsIds= Color::pluck('id');
        $countriesIds = Country::whereIn('country_name', ['Japan', 'South Korea'])->pluck('id');
        

        $cars = Car::factory(100)->create([

            'category_id' => function (array $attributes) use ($categoryIds) {
                return $categoryIds->random();
            },
            'fuel_type_id' => function (array $attributes) use ($fuelTypesIds) {
                return $fuelTypesIds->random();
            },
            'version_id' => function (array $attributes) use ($versionIds) {
                return $versionIds->random();
            },
            'exterior_color_id' => function(array $attributes) use ($colorsIds){
                return $colorsIds->random();
            },
            'interior_color_id' => function(array $attributes) use ($colorsIds){
                return $colorsIds->random();
            },
            'origin_country_id' => function(array $attributes)use($countriesIds){
                return $countriesIds->random();
            },
            
            // 'origin_port_id' => function(array $attributes)use($portsIds){
            //     return $portsIds->random();
            // },
        ]);
        foreach ($cars as $car) {
            // Create a CarPrice record for each car.
            CarPrice::factory()->create([
                'car_id' => $car->id,
                'is_current' => (true),
            ]);
            CarPrice::factory(2)->create([
                'car_id' => $car->id,
                'is_current' => (false),
            ]);

            Image::factory(1)->create([
                'car_id' => $car->id,
                'image_path' => function (array $attributes) use ($imagesCars) {
                    return $imagesCars->random();
                },
                'is_main' => (true),
            ]);

            // Create multiple Image records for each car.
            Image::factory(9)->create([
                'car_id' => $car->id,
                'image_path' => function (array $attributes) use ($imagesCars) {
                    return $imagesCars->random();
                },
                'is_main' => (false),
            ]);

        }

    }
}
