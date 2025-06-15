<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use App\Classes\Services\CategoryService;
use Inertia\Response;

class CategoryController extends Controller
{
    private CategoryService $categoryService;
    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = new CategoryService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch categories using the service
        $categories = $this->categoryService->Index();
        // Return the Inertia response with the categories
        return Inertia::render('car/settings/category', [
            'categories' => $categories,
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
        $this->categoryService->create($request);
        return redirect()->back()->with('success', 'Category created successfully');
        
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
    public function update(Request $request, Category $category)
    {
                try {
            // Validate the request data using the service
            $validator = $this->categoryService->DataValidation($request, 'patch', $category);
            if ($validator->fails()) {
                throw ValidationException::withMessages($validator->errors()->toArray());
            }

            $this->categoryService->Update($request, $category);
            return redirect()->back()->with('success', 'Category updated successfully');

        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
