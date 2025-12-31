<?php
namespace App\Classes\Services;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage; // Ensure Storage facade is imported
use Illuminate\Validation\Validator as ValidatorReturn;
use Illuminate\Support\Str;

Class BrandService
{
    public function Index()
    {
        $brands = Brand::all();
        $brands->map(function ($brand) {
            return [
                'id' => $brand->id,
                'brand_name' => $brand->brand_name,
                'logo' => $brand->logo, // Assuming logo is a string path or URL
                'created_at' => $brand->created_at->format('Y-m-d'),
                'updated_at' => $brand->updated_at->format('Y-m-d'),
            ];
        });
        return $brands;
    }

    public function Create(Request $request)
    {
        $name = Str::lower(trim(htmlspecialchars($request->brand_name)));
        $logoPath = null; // Initialize logo path to null

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            // Generate a unique file name
            $fileName = time() . '_' . Str::slug($name) . '.' . $file->getClientOriginalExtension();
            $logoPath = $file->storeAs('brand_logos', $fileName, 'public');
        }
        
        return Brand::create([
            "brand_name" => strtolower($name),
            "logo" => Storage::url($logoPath)
        ]);
    }

    public function Update(Request $request, Brand $brand): Brand
    {
        $name = Str::lower(trim(htmlspecialchars($request->input('brand_name'))));
        $logoPath = $brand->logo; // Keep existing logo path by default

        // Check if a new logo file has been uploaded
        if ($request->hasFile('logo')) {
            // Delete old logo if it exists
            if ($brand->logo && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }

            $file = $request->file('logo');
            // Generate a unique file name for the new logo
            $fileName = time() . '_' . Str::slug($name) . '.' . $file->getClientOriginalExtension();
            // Store the new file and get its relative path
            $logoPath = $file->storeAs('brand_logos', $fileName, 'public');
        } elseif ($request->input('clear_logo')) { // Frontend sends 'clear_logo' if user wants to remove image
            if ($brand->logo && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }
            $logoPath = null; // Set logo path to null to remove it from the database
        }

        $brand->update([
            "brand_name" => $name,
            "logo" => Storage::url($logoPath) // Save the updated relative path (or null)
        ]);

        return $brand;
    }

    public function Delete(Brand $brand): bool
    {
        // Delete the associated logo file when deleting the brand
        if ($brand->logo && Storage::disk('public')->exists($brand->logo)) {
            Storage::disk('public')->delete($brand->logo);
        }
        return $brand->delete();
    }

public function DataValidation(Request $request, string $method, $brand = null)
{
    if ($request->has('brand_name')) {
        $request->merge([
            'brand_name' => Str::lower($request->brand_name)
        ]);
    }

    $method = strtolower($method);
    $rules = [
        "logo" => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024']
    ];

    switch ($method) {
        case 'post':
            $rules["brand_name"] = [
                "required", "string", "max:255", 
                "unique:brands,brand_name", 
                "regex:/^[a-z0-9\s]+$/" // Updated regex for lowercase
            ];
            break;

        case 'patch':
        case 'put':
            $brandId = is_object($brand) ? $brand->id : null;

            $rules["brand_name"] = [
                "required", "string", "max:255", 
                Rule::unique("brands", "brand_name")->ignore($brandId), 
                "regex:/^[a-z0-9\s]+$/"
            ];
            break;

        default:
            return null;
    }

    return Validator::make($request->all(), $rules);
}
}