<?php

namespace App\Classes\Services;

use App\Models\City;

class CityService
{
    /**
     * Accesses the database to create a city record.
     */
    public function createCity(array $data)
    {
        return City::create([
            'name' => $data['name'],
            'country_id' => $data['country_id'],
            'is_hub' => $data['is_hub'] ?? false,
        ]);
    }

    /**
     * Accesses the database to delete a city record.
     */
    public function deleteCity(City $city)
    {
        return $city->delete();
    }
}