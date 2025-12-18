<?php

namespace App\Http\Controllers;

use App\Classes\Services\SellerService;
use App\Http\Resources\SellerResource;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException; // Import your service class
use Inertia\Inertia; // Important for handling validation errors from service

class SellerController extends Controller
{
    protected $sellerService;

    // Inject the SellerService into the controller
    public function __construct(SellerService $sellerService)
    {
        $this->sellerService = $sellerService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('car/settings/seller', [
            'sellers' => $this->sellerService->Index(), // Using the service to get data
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the request using the SellerService
        $validator = $this->sellerService->DataValidation($request, 'post');

        if ($validator->fails()) {
            // If validation fails, throw a ValidationException.
            throw new ValidationException($validator);
        }

        // 2. If validation passes, create the seller using the SellerService
        try {
            $this->sellerService->Create($request);

            // 3. Redirect back or to an index page with a success message
            return redirect()->route('carseller.index') // Assuming 'carseller.index' is your route name
                ->with('success', 'Seller created successfully!');
        } catch (\Exception $e) {
            // Handle any other exceptions during creation
            Log::error('Error creating seller: '.$e->getMessage()); // Log the error

            return back()->withErrors(['general' => 'Failed to create seller. Please try again.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Seller $seller)
    {
        // 1. Validate the request using the SellerService for 'patch' method
        $validator = $this->sellerService->DataValidation($request, 'patch', $seller);

        if ($validator->fails()) {
            // If validation fails, throw a ValidationException.
            throw new ValidationException($validator);
        }

        // 2. If validation passes, update the seller using the SellerService
        try {
            $this->sellerService->Update($request, $seller);

            // 3. Redirect back or to an index page with a success message
            return redirect()->route('carseller.index')
                ->with('success', 'Seller updated successfully!');
        } catch (\Exception $e) {
            // Handle any other exceptions during update
            Log::error('Error updating seller: '.$e->getMessage()); // Log the error

            return back()->withErrors(['general' => 'Failed to update seller. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Seller $seller)
    {
        try {
            $this->sellerService->Delete($seller);

            return redirect()->route('carseller.index')
                ->with('success', 'Seller deleted successfully!');
        } catch (\Exception $e) {
            Log::error('Error deleting seller: '.$e->getMessage()); // Log the error

            return back()->withErrors(['general' => 'Failed to delete seller. Please try again.']);
        }
    }

    /**
     * Display the details of a specific car.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Resources\Json\JsonResource
     */
    public function apiSellerProfile($id)
    {

        $dbSeller = Seller::with(['user'])->findOrFail($id);

        if (! $dbSeller) {
            return response()->json(
                [
                    'message' => 'Seller not found',
                ], 404
            );
        } else {
            return response()->json(
                [
                    'seller' => SellerResource::make($dbSeller),
                ]
            );
        }

    }
}
