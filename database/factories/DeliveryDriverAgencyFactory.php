<?php

namespace Database\Factories;

use App\Models\DeliveryDriverAgency;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeliveryDriverAgencyFactory extends Factory
{
    protected $model = DeliveryDriverAgency::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Logistics',
            'business_registration_number' => $this->faker->unique()->bothify('BRN-#####-??'),
            'tax_identification_number' => $this->faker->bothify('TIN-#########'),
            'contact_person' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->companyEmail(),
            'address' => $this->faker->address(),
            'fleet_size' => $this->faker->numberBetween(5, 50),
            'is_active' => true,
        ];
    }
}