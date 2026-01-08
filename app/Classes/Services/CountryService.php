<?php
namespace App\Classes\Services;

use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Illuminate\Support\Facades\Storage; // Required for file management

class CountryService
{
    public function Index()
    {
        // Using pagination as per your existing CountryService logic
        return Country::with('gatewayPorts')->orderBy('country_name', 'asc')->get();
    }

    public function DataValidation(Request $request, string $method, Country|null $country = null): ValidatorReturn|null
    {
        $rules = [
            // Using all fillable fields
            "country_name" => ["required", "string", "max:255", "regex:/^[a-zA-Z\s]+$/"],
            "code" => ["required", "string", "max:3", "min:2"],
            "prefix" => ["required", "string", "max:10"],
            "currency" => ["nullable", "string", "max:10"],
            "import_regulation_information" => ["nullable", "string"],
            // Flag is required for creation, nullable for update
            "flags" => [$method === 'post' ? 'required' : 'nullable', 'file', 'mimes:png,jpg,jpeg,svg', 'max:512'], 
        ];

        // Apply unique rules based on method
        if (strtolower($method) === 'post') {
            $rules["country_name"][] = "unique:countries,country_name";
            $rules["code"][] = "unique:countries,code";
            $rules["prefix"][] = "unique:countries,prefix";
        } elseif (strtolower($method) === 'patch' && $country) {
            $rules["country_name"][] = Rule::unique("countries", "country_name")->ignore($country->id);
            $rules["code"][] = Rule::unique("countries", "code")->ignore($country->id);
            $rules["prefix"][] = Rule::unique("countries", "prefix")->ignore($country->id);
        }

        return Validator::make($request->all(), $rules);
    }

    public function Create(Request $request): Country
    {
        $data = $request->only('country_name', 'code', 'prefix', 'currency','import_regulation_information');
        $data['country_name'] = trim(htmlspecialchars($data['country_name']));
        
        if ($request->hasFile('flags')) {

                $imageFile = $request->file('flags');
                $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('flags', $imageName,'public');
            $data['flags'] = Storage::url($path); 
        }

        return Country::create($data);
    }

    public function Update(Request $request, Country $country): Country
    {
        $data = $request->only('country_name', 'code', 'prefix', 'currency','import_regulation_information');
        $data['country_name'] = trim(htmlspecialchars($data['country_name']));
        $flagName = $country->flags;

        if ($request->hasFile('flags')) {
            if ($country->flags) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $country->flags));

            }
            
             $imageFile = $request->file('flags');
                $imageName = time() . '_' . uniqid() . '.' . $imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('flags', $imageName,'public');
            $data['flags'] = Storage::url($path); 
        } 
        
        $country->update($data);
        return $country;
    }

    public function Delete(Country $country): bool
    {
        // Delete the associated flag file
        if ($country->flags) {
             Storage::disk('public')->delete(str_replace('/storage/', '', $country->flags));
        }
        return $country->delete();
    }

/**
     * Set or update the gateway ports for a specific country.
     *
     * @param int $countryId
     * @param array $portIds  List of port IDs to be linked as gateways
     * @return bool
     */
    public function SetCountryGatewayPort(int $countryId, array $portIds): bool
    {
        return DB::transaction(function () use ($countryId, $portIds) {
            $country = Country::findOrFail($countryId);
            $country->gatewayPorts()->sync($portIds);
            return true;
        });
    }
}