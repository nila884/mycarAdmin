<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Classes\Services\ModuleService;
use Illuminate\Validation\ValidationException;

class ModuleController extends Controller
{
    protected $moduleService;

    // Inject the BrandService into the controller
    public function __construct(ModuleService $moduleService)
    {
        $this->moduleService = $moduleService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->moduleService->Index();
        // return Inertia::render('car/settings/module', [
        //     'modules' => $this->moduleService->Index(), // Using the service to get data
        // ]);
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
        // dd("oak");
        $validator = $this->moduleService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        try {
            return $this->moduleService->Create($request);
            // return
            // return redirect()->route('module.index')
            //     ->with('success', 'Module created successfully!');
        } catch (\Exception $e) {
            // return back()->withErrors(['general' => 'Failed to create brand. Please try again.']);
            return [
                "status" => false,
                "msg" => "Failed to create brand. Please try again."
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
    public function update(Request $request,  Module $module)
    {
        $validator =   $request->validate([

            "name" => ["required", Rule::unique("modules", "name")->ignore($module->id)]
        ]);
        // if ($validator->fails()) {
        //     throw new ValidationException($validator);
        // }
        try {
            return $this->moduleService->Update($request, $module);
            // return redirect()->route('module.index')
            //     ->with('success', 'Module updated successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update brand. Please try again.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Module $module)
    {
        
        try {
        return     $this->moduleService->Delete($module);
            return redirect()->route('module.index')
                ->with('success', 'Module deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete brand. Please try again.']);
        }
    }
}
