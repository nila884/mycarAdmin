<?php

namespace App\Http\Controllers;

use App\Classes\Services\ColorService;
use App\Models\color;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class colorController extends Controller
{
    protected $colorService;

    // Inject the BrandService into the controller
    public function __construct(ColorService $colorService)
    {
        $this->colorService = $colorService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       
        // return $this->colorService->Index();
        return Inertia::render('car/settings/color', [
            'colors' => $this->colorService->Index(), // Using the service to get data
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
       
        $validator = $this->colorService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            $this->colorService->Create($request);

            return redirect()->back()
                ->with('success', 'color created successfully!');
        } catch (\Exception $e) {
            // return back()->withErrors(['general' => 'Failed to create brand. Please try again.']);
            return [
                'status' => false,
                'msg' => 'Failed to create brand. Please try again.',
            ];
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
    public function update(Request $request, Color $color)
    {
          
        $validator = $this->colorService->DataValidation($request, 'patch',$color);
    
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
       
        try {
            $this->colorService->Update($request, $color);

            return redirect()->back()
                ->with('success', 'color updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update brand. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Color $color)
    {

        try {
            $this->colorService->Delete($color);

            return redirect()->route('color.index')
                ->with('success', 'color deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete brand. Please try again.']);
        }
    }
}
