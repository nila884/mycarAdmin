<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\FuelType as Fuel;
use App\Classes\Services\FuelTypeService as FuelService;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\FuelTypeResource;
use Illuminate\Http\JsonResponse;

class FuelController extends Controller
{
        private FuelService $fuelService;
    public function __construct(FuelService $fuelService)
    {
        $this->fuelService = new FuelService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       // Fetch fuels using the service
        $fuels = $this->fuelService->Index();
        // Return the Inertia response with the fuels
        return Inertia::render('car/settings/fuel', [
            'fuels' => $fuels,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
                try {
            // Validate the request data using the service
            $validator = $this->fuelService->DataValidation($request, 'post'); // Call validation for 'post' method
            if ($validator->fails()) {
                throw ValidationException::withMessages($validator->errors()->toArray());
            }

            $this->fuelService->create($request);
            return redirect()->back()->with('success', 'Fuel type created successfully');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
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
    public function update(Request $request, Fuel $fuelType)
    {
                        try {
            // Validate the request data using the service
            $validator = $this->fuelService->DataValidation($request, 'patch', $fuelType);
            if ($validator->fails()) {
                throw ValidationException::withMessages($validator->errors()->toArray());
            }

            $this->fuelService->Update($request, $fuelType);
            return redirect()->back()->with('success', 'Fuel updated successfully');

        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
                try {
            $fuel = Fuel::findOrFail($id);
            $this->fuelService->Delete($fuel);
            return redirect()->back()->with('success', 'Fuel deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Fuel not found or could not be deleted.']);
        }
    }

    /**
     * API endpoint to get all fuel types.
     */ public function apiIndex(): JsonResponse
    {
        return FuelTypeResource::collection(Fuel::all())->response();
    }
}
