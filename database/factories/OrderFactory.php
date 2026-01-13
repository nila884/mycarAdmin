<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $fob = $this->faker->randomFloat(2, 5000, 50000);
        $freight = $this->faker->randomFloat(2, 800, 2500);
        $transit = $this->faker->randomFloat(2, 200, 1000);
        $clearing = $this->faker->randomFloat(2, 300, 1500);

        return [
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => User::factory(),
            'car_id' => Car::factory(),
            
            'fob_price' => $fob,
            'sea_freight' => $freight,
            'land_transit' => $transit,
            'clearing_fee' => $clearing,
            'total_amount' => $fob + $freight + $transit + $clearing,

            'origin_port' => $this->faker->city() . ' Port',
            'destination_port' => $this->faker->city() . ' Port',
            'final_destination_city' => $this->faker->city(),

            'status' => $this->faker->randomElement(['quote', 'proforma', 'paid', 'cancelled']),
            'expires_at' => now()->addDays(7),
        ];
    }
}