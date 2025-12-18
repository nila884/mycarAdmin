<?php

namespace App\Http\Controllers;

use App\Classes\Services\FeatureService;
use App\Http\Resources\FeatureResource;
use App\Models\Feature;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request; // Import your service
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

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

            return redirect()->route('carfeature.index')->with('success', 'Car feature created successfully!');
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

            return redirect()->route('carfeature.index')->with('success', 'Car feature updated successfully!');
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
     */
    public function apiIndex(): JsonResponse
    {

        $features = Feature::orderBy('feature_name', 'asc')->get();

        return FeatureResource::collection($features)->response();
    }
}
