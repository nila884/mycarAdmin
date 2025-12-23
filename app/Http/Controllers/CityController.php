<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Classes\Services\CityService; // Assuming you create this service based on your design
use Illuminate\Http\Request;

class CityController extends Controller
{
    protected $service;

    /**
     * Inject the CityService to handle database interactions.
     */
    public function __construct(CityService $service)
    {
        $this->service = $service;
    }

    /**
     * Store a newly created city in storage.
     * The controller validates the request and delegates the DB save to the service.
     */
    public function store(Request $request)
    {
        // Validation logic
       $validated= $request->validate([
            'name' => 'required|string|max:255',
            'country_id' => 'required|exists:countries,id',
            'is_hub' => 'nullable|boolean', // Added to support your precision logistics logic
        ]);

        // Delegate database access to the service as per your app design
        $this->service->createCity($validated);

        return back()->with('success', 'City added successfully.');
    }

    /**
     * Remove the specified city from storage.
     */
    public function destroy(City $city)
    {
        // Delegate deletion to the service
        $this->service->deleteCity($city);

        return back()->with('success', 'City removed.');
    }
}