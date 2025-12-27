<?php

namespace App\Classes\Services;


use App\Models\CarModel; // Ensure correct casing for carModel model
use App\Models\Brand; // Import Brand model to fetch brands
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Illuminate\Support\Str; // For slugging if needed, though not directly used for model_name here

class CarModelService
{
    public function Index()
    {
        $carModels = carModel::with('brand')->paginate(15);
        $carModels->getCollection()->transform(function ($model) {
            return [
                'id' => $model->id,
                'model_name' => $model->model_name,
                'brand_id' => $model->brand_id,
                'brand_name' => $model->brand->brand_name ?? 'N/A',
                'created_at' => $model->created_at->format('Y-m-d'),
                'updated_at' => $model->updated_at->format('Y-m-d'),
            ];
        });

        return $carModels;
    }

    public function create(Request $request)
    {
        $name = strtolower(trim(htmlspecialchars($request->model_name))); // Ensure lowercase
        // Assuming brand_name is sent from frontend, find its ID
        $brand = Brand::where('brand_name', strtolower($request->brand_name))->first();

        if (!$brand) {
            // Handle case where brand is not found (e.g., throw an exception or return error)
            // For now, let validation handle it if brand_id is required
            return null; // Or throw an exception
        }

        return CarModel::create([
            "model_name" => $name,
            "brand_id" => $brand->id // Use the found brand ID
        ]);
    }

    public function read(int $id)
    {
        return carModel::with('brand')->find($id); // Eager load brand for read
    }

    public function update(Request $request, carModel $carModel): carModel
    {
        $name = strtolower(trim(htmlspecialchars($request->model_name))); // Ensure lowercase
        $brandId = $carModel->brand_id; // Default to current brand ID

        // If brand_name is provided from the frontend, find its ID
        if ($request->has('brand_name')) {
            $brand = Brand::where('brand_name', strtolower($request->brand_name))->first();
            if ($brand) {
                $brandId = $brand->id;
            }
        }
        $carModel->update([
            "model_name" => $name,
            "brand_id" => $brandId
        ]);
        return $carModel;
    }

    public function delete(carModel $carModel): bool
    {
        // No associated files, so direct delete is fine
        return $carModel->delete();
    }

    public function getAllBrands()
    {
        // Helper to get all brands for dropdowns in frontend
        return Brand::select('id', 'brand_name')->get()->map(function($brand) {
            return [
                'id' => $brand->id,
                'brand_name' => $brand->brand_name,
            ];
        });
    }

    public function DataValidation(Request $request, String $method, carModel|bool $carModel = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "model_name" => ["required", "string", "max:255", "unique:car_models,model_name", 'regex:/^[a-zA-Z0-9\s\'-]+$/'], // Added regex
                    "brand_name" => ["required", "string", "exists:brands,brand_name"] // Validate brand_name existence
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "model_name" => ["required", "string", "max:255", Rule::unique("car_models", "model_name")->ignore($carModel->id), 'regex:/^[a-zA-Z0-9\s\'-]+$/'], // Added regex
                    "brand_name" => ["required", "string", "exists:brands,brand_name"] // Validate brand_name existence
                ]);
            default:
                return null;
        }
    }
}
