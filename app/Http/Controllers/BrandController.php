<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Brand;
use App\Classes\Services\BrandService;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\BrandResource;
use Illuminate\Http\JsonResponse;

class BrandController extends Controller
{
    protected $brandService;

    public function __construct(BrandService $brandService)
    {
        $this->brandService = $brandService;
    }


    public function index()
    {
        return Inertia::render('car/settings/brand', [
            'brands' => $this->brandService->Index(),
        ]);
    }

   
    public function store(Request $request)
    {
        
        $validator = $this->brandService->DataValidation($request, 'post');

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->brandService->Create($request);
            return redirect()->route('carbrand.index')
                             ->with('success', 'Brand created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create brand. Please try again.']);
        }
    }

    public function update(Request $request, Brand $brand)
    {
        $validator = $this->brandService->DataValidation($request, 'patch', $brand);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->brandService->Update($request, $brand);
            return redirect()->route('carbrand.index')
                             ->with('success', 'Brand updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update brand. Please try again.']);
        }
    }

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

    public function apiIndex(): JsonResponse
    {

        $brands = Brand::orderBy('brand_name', 'asc')->get();
     
        return BrandResource::collection($brands)->response();
    }             
}