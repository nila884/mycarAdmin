<?php
namespace App\Classes\Services;

use App\Models\Version;
use App\Models\CarModel; // Import CarModel to fetch car models for dropdowns
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;


Class VersionService
{
    public function Index()
    {
        // Eager load the 'carModel' relationship to get car model names
        $carVersions = Version::with('carModel')->paginate(15);

        // Map the collection to format data for frontend, including car model name
        $carVersions->getCollection()->transform(function($version){
            return[
                'id' => $version->id,
                'car_model_id' => $version->car_model_id,
                'car_model_name' => $version->carModel->model_name ?? 'N/A', // Get model name, handle if carModel is null
                'version_name' => $version->version_name,
                'version_year' => $version->version_year,
                'created_at' => $version->created_at->format('Y-m-d'),
                'updated_at' => $version->updated_at->format('Y-m-d'),
            ];
        });
        return $carVersions;
    }

    public function Create(Request $request)
    {
        // Find car_model_id from model_name
        $carModel = CarModel::where('model_name', strtolower($request->model_name))->first();

        if (!$carModel) {
            // This case should ideally be caught by validation (exists:car_models,model_name)
            // but good to have a fallback or specific error if not.
            throw new \Exception('Car model not found for the provided name.');
        }

        $versionYear = trim(htmlspecialchars($request->version_year));
        $versionName = trim(htmlspecialchars($request->version_name));
        
        return Version::create([
            "car_model_id" => $carModel->id, // Use the found car model ID
            "version_name" => $versionName,
            "version_year" => $versionYear
        ]);
    }

    public function read(int $id)
    {
        return Version::with('carModel')->find($id); // Eager load carModel for read
    }

    public function Update(Request $request, Version $version): Version
    {
        $versionYear = trim(htmlspecialchars($request->version_year));
        $versionName = trim(htmlspecialchars($request->version_name));
        $modelId = $version->car_model_id; // Default to current car_model_id

        // If model_name is provided from the frontend, find its ID
        if ($request->has('model_name')) {
            $carModel = CarModel::where('model_name', strtolower($request->model_name))->first();
            if ($carModel) {
                $modelId = $carModel->id;
            }
        }

        $version->update([
            "car_model_id" => $modelId,
            "version_name" => $versionName,
            "version_year" => $versionYear
        ]);
        return $version;
    }

    public function Delete(Version $version): bool
    {
        return $version->delete();
    }

    public function getAllCarModels()
    {
        // Helper to get all car models for dropdowns in frontend
        return CarModel::select('id', 'model_name')->get()->map(function($carModel) {
            return [
                'id' => $carModel->id,
                'model_name' => $carModel->model_name,
            ];
        });
    }

    public function DataValidation(Request $request, String $method, Version|bool $version = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "model_name" => ["required", "string", "exists:car_models,model_name"], // Validate model_name existence
                    "version_name" => ["required", "string", "max:255"],
                    "version_year" => ["nullable", "string", "max:4", "regex:/^\d{4}$/"], // Year should be 4 digits
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "model_name" => ["required", "string", "exists:car_models,model_name",], // Validate model_name existence
                    "version_name" => ["required", "string", "max:255"],
                    "version_year" => ["nullable", "string", "max:4", "regex:/^\d{4}$/"],
                ]);
            default:
                return null;
        }
    }

}