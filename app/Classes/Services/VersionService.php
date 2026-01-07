<?php

namespace App\Classes\Services;

use App\Models\Brand;
use App\Models\Version;
use App\Models\CarModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VersionService
{
public function Index()
{

    return Version::with(['carModel.brand'])
        ->latest()
        ->paginate(15);
}

    public function Create(Request $request)
    {
        // No need to look up model manually; validation "exists" check handles it
        return Version::create([
            "car_model_id" => $request->car_model_id,
            "version_name" => trim(htmlspecialchars($request->version_name)),
            "version_year" => $request->version_year ? trim($request->version_year) : null
        ]);
    }

    public function Update(Request $request, Version $version): Version
    {
        // Directly use the ID passed from the Shadcn Select
        $version->update([
            "car_model_id" => $request->input('car_model_id', $version->car_model_id),
            "version_name" => trim(htmlspecialchars($request->version_name)),
            "version_year" => $request->input('version_year', $version->version_year)
        ]);

        return $version->fresh();
    }

    public function DataValidation(Request $request, string $method, $version = null)
    {
        $rules = [
            "car_model_id" => ["required", "exists:car_models,id"],
            "version_name" => ["required", "string", "max:255"],
            "version_year" => ["nullable", "integer", "between:1901,2155"], 
        ];

        // If you want version names to be unique PER model/year, you can add:
        // Rule::unique('versions')->where(fn($q) => $q->where('car_model_id', $request->car_model_id)...)

        return Validator::make($request->all(), $rules);
    }

    public function Delete(Version $version): bool
    {
        return $version->delete();
    }

    public function getAllCarModels()
    {
        return CarModel::select('id', 'model_name', 'brand_id')->get();
    }

    public function getAllBrands()
    {
        return Brand::select('id', 'brand_name')->get();
    }
}