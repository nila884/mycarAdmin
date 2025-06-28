<?php
namespace App\Classes\Services;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

Class CategoryService
{
    public function Index()
    {
        $categories = Category::all();
      
             $categories->map(function ($category) {
            return [
                'id' => $category->id,
                'category_name' => $category->name,
                'created_at' => $category->created_at->format('Y-m-d'), // Format for display
                'updated_at' => $category->updated_at->format('Y-m-d'), // Format for display
            ];
        });
        return $categories;
    }

    public function Create(Request $request)
    {
        
        $name = trim(htmlspecialchars($request->category_name));
        return Category::create([
            "category_name" => $name,
        ]);
    }

    public function Update(Request $request, Category $category): Category
    {
        $name = trim(htmlspecialchars($request->category_name));
        $category->update([
            "category_name" => $name
        ]);
        return $category;
        
    }

    public function Delete(Category $category): bool
    {
        return $category->delete();
    }


    public function DataValidation(Request $request, String $method, Category|bool $category = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "category_name" => ["required", "unique:categories,category_name",'regex:/^[a-z0-9\s]*$/', 'max:255'],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "category_name" => ["required", Rule::unique("categories", "category_name")->ignore($category->id), 'regex:/^[a-z0-9\s]*$/', 'max:255'],
                ]);
            default:
                return null;
        }
    }

}
