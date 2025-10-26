<?php
namespace App\Classes\Services;

use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;
use Illuminate\Support\Facades\Storage; // Required for file management

class CountryService
{
    public function Index()
    {
        // Using pagination as per your existing CountryService logic
        return Country::orderBy('country_name', 'asc')->paginate(15);
    }

    public function DataValidation(Request $request, string $method, Country|null $country = null): ValidatorReturn|null
    {
        $rules = [
            // Using all fillable fields
            "country_name" => ["required", "string", "max:255", "regex:/^[a-zA-Z\s]+$/"],
            "code" => ["required", "string", "max:3", "min:2"],
            "prefix" => ["required", "string", "max:10"],
            "currency" => ["nullable", "string", "max:10"],
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
        $data = $request->only('country_name', 'code', 'prefix', 'currency');
        $data['country_name'] = trim(htmlspecialchars($data['country_name']));
        
        if ($request->hasFile('flags')) {
            // Store file to 'public/country' folder
            $flagPath = $request->file('flags')->store('country', 'public');
            // Save only the filename in the database (e.g., '123_filename.png')
            $data['flags'] = basename($flagPath); 
        }

        return Country::create($data);
    }

    public function Update(Request $request, Country $country): Country
    {
        $data = $request->only('country_name', 'code', 'prefix', 'currency');
        $data['country_name'] = trim(htmlspecialchars($data['country_name']));
        $flagName = $country->flags; // Keep existing flag by default

        if ($request->hasFile('flags')) {
            // Delete old flag if it exists in storage
            if ($country->flags) {
                 Storage::disk('public')->delete('country/' . $country->flags);
            }
            
            $flagPath = $request->file('flags')->store('country', 'public');
            $flagName = basename($flagPath);
        } 
        
        $country->update(array_merge($data, ["flags" => $flagName]));
        return $country;
    }

    public function Delete(Country $country): bool
    {
        // Delete the associated flag file
        if ($country->flags) {
            Storage::disk('public')->delete('country/' . $country->flags);
        }
        return $country->delete();
    }
}