<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Version;
use App\Classes\Services\VersionService; // Import your service
use Illuminate\Validation\ValidationException;
use App\Http\Resources\VersionResource;
use Illuminate\Http\JsonResponse;

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
            'versions' => $this->versionService->Index(), // Get paginated versions
            'carModels' => $this->versionService->getAllCarModels(), // Pass all car models for dropdowns
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
            $this->versionService->create($request);
            return redirect()->route('carversion.index')->with('success', 'Car version created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create car version. Please try again.']);
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