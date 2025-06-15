<?php
namespace App\Classes\Services;

use App\Models\FuelType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

Class FuelTypeService
{
    public function Index()
    {
        $fuelType =  FuelType::paginate(15);
        return $fuelType;
    }

    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->fuel_type));
        return FuelType::create([
            "fuel_type" => $name,
        ]);
    }

    public function Update(Request $request, FuelType $fuelType): FuelType
    {
        $name = trim(htmlspecialchars($request->fuel_type));
        $fuelType->update([
            "fuel_type" => $name
        ]);
        return $fuelType;
    }

    public function Delete(FuelType $fuelType): bool
    {
        return $fuelType->delete();
    }


    public function DataValidation(Request $request, String $method, FuelType|bool $fuelType = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "fuel_type" => ["required", "unique:fuel_types,fuel_type"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "fuel_type" => ["required", Rule::unique("fuel_types", "fuel_type")->ignore($fuelType->id)],
                ]);
            default:
                return null;
        }
    }

}
