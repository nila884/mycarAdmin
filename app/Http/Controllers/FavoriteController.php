<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\CarListingResource;
use App\Models\Car;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Helper to get the Client model from the authenticated User
     */
    private function getClient(Request $request) 
    {
        return $request->user()->client; 
    }

    public function toggle(Request $request)
    {
        $request->validate(['car_id' => 'required|exists:cars,id']);
        
        // Access favorites through the Client model
        $status = $this->getClient($request)->favoriteCars()->toggle($request->car_id);
        
        return response()->json([
            'attached' => count($status['attached']) > 0,
            'message' => 'Favorite status updated'
        ]);
    }

    public function index(Request $request)
    {
        $ids = $this->getClient($request)->favoriteCars()->pluck('cars.id');
        return response()->json($ids);
    }

public function listObjects(Request $request)
{

$client = $request->user()->client;

    if (!$client) {
        return response()->json(['error' => 'Client profile not found'], 404);
    }

    // 3. Use the relationship you defined to get cars with all needed details
    $cars = $client->favoriteCars()
        ->with([
            'imageMain', 
            'version.carModel.brand', 
            'originCountry',
            'currentPrice',
        ])
        ->get();
        
    return CarListingResource::collection($cars);
}

    public function sync(Request $request)
    {
        $request->validate(['car_ids' => 'required|array']);
        
        // Sync guest IDs to the Client profile
        $this->getClient($request)->favoriteCars()->syncWithoutDetaching($request->car_ids);

        return response()->json(['message' => 'Favorites synced successfully']);
    }

    public function getGuestObjects(Request $request)
{
    $request->validate([
        'ids' => 'required|array',
        'ids.*' => 'exists:cars,id'
    ]);

    $cars = Car::whereIn('id', $request->ids)
        ->with([
            'imageMain', 
            'version.carModel.brand', 
            'originCountry',
            'currentPrice',
        ])
        ->get();

    return CarListingResource::collection($cars);
}

    // public function getObjects(Request $request)
    // {
    //     // 1. Validate that 'ids' is an array
    //     $request->validate([
    //         'ids' => 'required|array',
    //         'ids.*' => 'exists:cars,id' // Ensure the IDs actually exist in your cars table
    //     ]);

    //     $ids = $request->input('ids');

    //     // 2. Fetch the cars with all necessary relationships to satisfy CarCardObject
    //     // We load brand, model, version, and images to avoid "undefined" errors in React
    //     $cars = Car::with([
    //         'version.model.brand', 
    //         'images', 
    //         'originCountry', 
    //         'seller'
    //     ])
    //     ->whereIn('id', $ids)
    //     ->get();

       

    //     return response()->json(CarListingResource::collection($cars));
    // }

}