<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Feature;
use App\Classes\Services\FeatureService; // Import your service
use App\Http\Resources\FeatureResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class FeatureController extends Controller
{
    protected $featureService;

    public function __construct(FeatureService $featureService)
    {
        $this->featureService = $featureService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('car/settings/feature', [
            'features' => $this->featureService->Index(), // Get paginated features
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $validator = $this->featureService->DataValidation($request, 'post');

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        try {
            $this->featureService->Create($request);
            return redirect()->back()->with('success', 'Car feature created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create car feature. Please try again.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Feature $feature)
    {
        $validator = $this->featureService->DataValidation($request, 'patch', $feature);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        try {
            $this->featureService->update($request, $feature);
            return redirect()->back()->with('success', 'Car feature updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update car feature. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Feature $feature)
    {
        try {
            $this->featureService->delete($feature);
            return redirect()->route('carfeature.index')->with('success', 'Car feature deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete car feature. Please try again.']);
        }
    }


       /**
     * Return a listing of all brands for API consumption.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiIndex(): JsonResponse
    {

        $features = Feature::orderBy('feature_name', 'asc')->get();
     
        return FeatureResource::collection($features)->response();
    } 
    
           /**
     * Return a listing of all brands for API consumption.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function apiFeatureMain(): JsonResponse
    {

     $features = Feature::where('is_main', true)
    ->orderBy('feature_name', 'asc')
    ->get();
     
        return FeatureResource::collection($features)->response();
    } 
}