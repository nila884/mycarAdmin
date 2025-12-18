<?php

namespace Database\Factories;

use App\Models\CarPrice;
use Illuminate\Database\Eloquent\Factories\Factory;

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
        // 1. Define the base car price
        $basePrice = $this->faker->randomFloat(2, 5000, 100000); // Price between $5,000 and $100,000

        // 2. Randomly decide if a discount will be applied (e.g., 70% chance)
        if ($this->faker->boolean(70)) {
            // 3. Randomly choose discount type
            $discountType = $this->faker->randomElement(['amount', 'percent']);

            if ($discountType === 'amount') {
                // Discount is a fixed amount: 5% to 20% of the base price
                $maxDiscount = $basePrice * 0.20;
                $minDiscount = $basePrice * 0.05;

                // Ensure the discount is a clean value (e.g., ends in 00 or 50)
                $discount = round($this->faker->randomFloat(2, $minDiscount, $maxDiscount) / 50) * 50;

            } else { // 'percentage'
                // Discount is a percentage: 5% to 25%
                $discount = $this->faker->numberBetween(5, 25);
            }

        } else {
            // No discount applied
            $discountType = null;
            $discount = 0.00;
        }

        // 4. Calculate Final Price (optional, but good for data integrity)
        $finalPrice = $basePrice;
        if ($discount > 0 && $discountType !== null) {
            if ($discountType === 'amount') {
                $finalPrice = max(0, $basePrice - $discount);
            } else { // percentage
                $finalPrice = $basePrice * (1 - ($discount / 100));
            }
        }

        return [
            'price' => $basePrice,
            'discount' => $discount,
            'discount_type' => $discountType,
            // 'final_price' => $finalPrice, // Assuming you have a final_price column
            // 'is_current' => true,
            // 'car_id' is typically set when creating the price via the CarSeeder
        ];
    }
}
