<?php
namespace App\Classes\Services;

use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

Class FeatureService
{
    public function Index()
    {
        $feature =  Feature::paginate(15);
        return $feature;
    }

    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->feature_name));
        return Feature::create([
            "feature_name" => $name,
        ]);
    }

    public function Update(Request $request, Feature $feature): Feature
    {
        $name = trim(htmlspecialchars($request->feature_name));
        $feature->update([
            "feature_name" => $name
        ]);
        return $feature;
    }

    public function Delete(Feature $brand): bool
    {
        return $brand->delete();
    }


    public function DataValidation(Request $request, String $method, Feature|bool $feature = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "feature_name" => ["required", "unique:features,feature_name"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "feature_name" => ["required", Rule::unique("features", "feature_name")->ignore($feature->id)],
                ]);
            default:
                return null;
        }
    }

}
