<?php
namespace App\Classes\Services;

use App\Models\Version;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;


Class VersionService
{
    public function Index()
    {
        $version =  Version::paginate(15);
        return $version;
    }

    public function Create(Request $request)
    {
        $validator = $this->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }
        $versionYear = trim(htmlspecialchars($request->version_year));
        $versionName = trim(htmlspecialchars($request->version_name));
        $modelId = $request->car_model_id;
        return Version::create([
            "car_model_id" => $modelId,
            "version_name" => $versionName,
            "version_year" => $versionYear
        ]);

    }

    public function Update(Request $request, Version $version)
    {
        $validator = $this->DataValidation($request, 'patch', $version);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $versionYear = trim(htmlspecialchars($request->version_year));
        $versionName = trim(htmlspecialchars($request->version_name));
        $modelId = $request->car_model_id;

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


    public function DataValidation(Request $request, String $method, Version|bool $version = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "car_model_id" => ["required", "exists:car_models,id"],
                    "version_name" => ["required"],
                    "version_year" => ["nullable"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "car_model_id" => ["required", "exists:car_models,id"],
                    "version_name" => ["required"],
                    "version_year" => ["nullable"],
                ]);
            default:
                return null;
        }
    }

}
