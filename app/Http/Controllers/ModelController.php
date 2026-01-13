<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\CarModel; // Ensure correct casing for CarModel
use App\Classes\Services\CarModelService; // Import your service
use App\Classes\Services\BrandService; // Import BrandService to get brands
use Illuminate\Validation\ValidationException;
use App\Http\Resources\ModelResource; // Import ModelResource for API responses
use Illuminate\Http\JsonResponse;

class ModelController extends Controller
{
    protected $carModelService;
    protected $brandService; // Inject BrandService

    public function __construct(CarModelService $carModelService, BrandService $brandService)
    {
        $this->carModelService = $carModelService;
        $this->brandService = $brandService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('car/settings/model', [
            'models' => $this->carModelService->Index(), // Get paginated models
            'brands' => $this->brandService->Index(), // Pass all brands for dropdowns
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
              
        $validator = $this->carModelService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->carModelService->create($request);
            return redirect()->route('carmodel.index')->with('success', 'Car model created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create car model. Please try again.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CarModel $carModel)
    {
        
        $validator = $this->carModelService->DataValidation($request, 'patch', $carModel);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        try {
            $this->carModelService->update($request, $carModel);
            return redirect()->route('carmodel.index')->with('success', 'Car model updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update car model. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CarModel $carModel)
    {
        try {
            $this->carModelService->delete($carModel);
            return redirect()->route('carmodel.index')->with('success', 'Car model deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete car model. Please try again.']);
        }
    }

    /**
     * fetch all car model.
     */   public function apiIndex(): JsonResponse
    {
        return ModelResource::collection(CarModel::all())->response();
    }
}
