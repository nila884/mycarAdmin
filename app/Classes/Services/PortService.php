<?php
namespace App\Classes\Services;

use App\Models\Port;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use App\Models\Country;
use App\Http\Resources\CountryResource;

class PortService
{
    public function Index()
    {
        // Eager load country for efficient data fetching
        return Port::with('country')->orderBy('country_id', 'asc')->get(); 
    }

    public function DataValidation(Request $request, string $method, Port|null $port = null): ValidatorReturn|null
    {
        $rules = [
            "name" => ["required", "string", "max:255"],
            "code" => ["nullable", "string", "max:10"],
            "country_id" => ["required", "exists:countries,id"], // Ensure country exists
        ];

        // Custom Rule to enforce Port name uniqueness per Country
        $uniqueNamePerCountry = Rule::unique('ports', 'name')
            ->where(fn ($query) => $query->where('country_id', $request->country_id));

        if (strtolower($method) === 'post') {
            $rules["name"][] = $uniqueNamePerCountry;
        } elseif (strtolower($method) === 'patch' && $port) {
            $rules["name"][] = $uniqueNamePerCountry->ignore($port->id);
            // Unique check for code across all ports (if your DB schema requires it)
            $rules["code"][] = Rule::unique('ports', 'code')->ignore($port->id);
        }

        return Validator::make($request->all(), $rules);
    }

    public function Create(Request $request): Port
    {
        return Port::create($request->only('name', 'code', 'country_id'));
    }

    public function Update(Request $request, Port $port): Port
    {
        $port->update($request->only('name', 'code', 'country_id'));
        return $port;
    }

    public function Delete(Port $port): bool
    {
        return $port->delete();
    }

    public function getAllCountries()
    {
        return CountryResource::collection( Country::orderBy('country_name', 'asc')->get())->resolve();
    }
}