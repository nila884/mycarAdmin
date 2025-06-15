<?php
namespace App\Classes\Services;

use App\Models\EnginePower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

Class EnginePowerService
{
    public function Index()
    {
        $enginePower =  EnginePower::paginate(15);
        return $enginePower;
    }

    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->power));
        return EnginePower::create([
            "power" => $name,
        ]);
    }

    public function Update(Request $request, EnginePower $enginePower): EnginePower
    {
        $name = trim(htmlspecialchars($request->power));
        $enginePower->update([
            "power" => $name
        ]);
        return $enginePower;
    }

    public function Delete(EnginePower $enginePower): bool
    {
        return $enginePower->delete();
    }


    public function DataValidation(Request $request, String $method, EnginePower|bool $enginePower = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "power" => ["required", "unique:engine_powers,power"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "power" => ["required", Rule::unique("engine_powers", "power")->ignore($enginePower->id)],
                ]);
            default:
                return null;
        }
    }

}
