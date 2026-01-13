<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Version;
use App\Classes\Services\VersionService; // Import your service
use App\Http\Resources\BrandResourceManagement;
use App\Http\Resources\ModelResourceManagement;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\VersionResource;
use App\Http\Resources\VersionResourceManagement;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class VersionController extends Controller
{
    protected $versionService;

    public function __construct(VersionService $versionService)
    {
        $this->versionService = $versionService;

    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {

        return Inertia::render('car/settings/version', [
            'versions' => VersionResourceManagement::collection($this->versionService->Index()), 
            'brands' => BrandResourceManagement::collection($this->versionService->getAllBrands()), 
            'carModels' => ModelResourceManagement::collection($this->versionService->getAllCarModels()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
public function store(Request $request)
{
    $validator = $this->versionService->DataValidation($request, 'post');
    if ($validator->fails()) {
        throw new ValidationException($validator);
    }

    try {
        $this->versionService->Create($request);
        return redirect()->route('carversion.index')->with('success', 'Car version created successfully!');
    } catch (\Exception $e) {
        // Log the actual error for debugging in AWS CloudWatch
        Log::error("Version Creation Error: " . $e->getMessage());
        
        return back()->withErrors(['general' => 'Server error. Please try again later.'])->withInput();
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Version $version)
    {
        $validator = $this->versionService->DataValidation($request, 'patch', $version);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        try {
            $this->versionService->update($request, $version);
            return redirect()->route('carversion.index')->with('success', 'Car version updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update car version. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Version $version)
    {
        try {
            $this->versionService->delete($version);
            return redirect()->route('carversion.index')->with('success', 'Car version deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete car version. Please try again.']);
        }
    }

    /**
     * API endpoint to get all versions.
     */
        public function apiIndex(): JsonResponse
    {
       return VersionResource::collection(Version::all())->response();
    }
}