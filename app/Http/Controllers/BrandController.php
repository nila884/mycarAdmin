<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Brand;
use App\Classes\Services\BrandService; // Import your service class
use Illuminate\Validation\ValidationException; // Important for handling validation errors from service
use App\Http\Resources\BrandResource; // Import the resource for API responses
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    protected $brandService;

    // Inject the BrandService into the controller
    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Use the service to get paginated brands if needed, or keep Brand::all()
        return Inertia::render('car/settings/brand', [
            'brands' => $this->brandService->Index(), // Using the service to get data
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // This method is typically for showing a dedicated create page,
        // but since you're using a dialog, it might not be explicitly used.
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Validate the request using the BrandService
        $validator = $this->brandService->DataValidation($request, 'post');

        if ($validator->fails()) {
            // If validation fails, throw a ValidationException.
            // Inertia will automatically catch this and pass errors back to the frontend.
            throw new ValidationException($validator);
        }

        // 2. If validation passes, create the brand using the BrandService
        try {
            $this->brandService->Create($request);

            // 3. Redirect back or to an index page with a success message
            return redirect()->route('carbrand.index') // Assuming 'carbrand.index' is your route name for listing brands
                             ->with('success', 'Brand created successfully!');
        } catch (\Exception $e) {
            // Handle any other exceptions during creation (e.g., file move error)
            // You might want to log this error and return a more generic error message
            return back()->withErrors(['general' => 'Failed to create brand. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        // 1. Validate the request using the BrandService for 'patch' method
        $validator = $this->brandService->DataValidation($request, 'patch', $brand);

        if ($validator->fails()) {
            // If validation fails, throw a ValidationException.
            throw new ValidationException($validator);
        }

        // 2. If validation passes, update the brand using the BrandService
        try {
            $this->brandService->Update($request, $brand);

            // 3. Redirect back or to an index page with a success message
            return redirect()->route('carbrand.index')
                             ->with('success', 'Brand updated successfully!');
        } catch (\Exception $e) {
            // Handle any other exceptions during update (e.g., file move error)
            return back()->withErrors(['general' => 'Failed to update brand. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
           try {
            $this->brandService->Delete($brand);
            return redirect()->route('carbrand.index')
                             ->with('success', 'Brand deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete brand. Please try again.']);
        }
    }

       /**
     * Return a listing of all brands for API consumption.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiIndex(): JsonResponse
    {

        $brands = Brand::orderBy('brand_name', 'asc')->get();
     
        return BrandResource::collection($brands)->response();
    }             
}