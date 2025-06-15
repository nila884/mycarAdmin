<?php
namespace App\Classes\Services;


use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorReturn;

class CountryService
{
    public function Index()
    {
        $country =  Country::paginate(15);
        return $country;
    }
    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->country_name));
        $code = trim(htmlspecialchars($request->code));
        $prefix = trim(htmlspecialchars($request->prefix));
        return Country::create([
            "country_name" => $name,
            "code" => $code,
            "prefix" => $prefix,
        ]);
    }
    public function Update(Request $request, Country $country): Country
    {
        $name = trim(htmlspecialchars($request->country_name));
        $code = trim(htmlspecialchars($request->code));
        $prefix = trim(htmlspecialchars($request->prefix));
        $currency = trim(htmlspecialchars($request->currency));
        $flag = $request->flags;
        $flag_file = $country->id . '_' . $flag->getClientOriginalName();
        // $type = $flag->getClientMimeType();
        // $size = $flag->getSize();
        $flag->move(storage_path('app/public/country'), $flag_file);
        $country->update([
            "country_name" => $name,
            "code" => $code,
            "prefix" => $prefix,
            "currency" => $currency,
            "flags"=>$flag_file
        ]);
        return $country;
    }

    public function Delete(Country $country): bool
    {
        return $country->delete();
    }
    /**
     * Validation
     *
     * @param  Request $request
     * @param  string $method
     * @param  Country|bool $country
     * @return ValidatorReturn|null
     */
    public function DataValidation(Request $request, String $method, Country|bool $country = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "country_name" => ["required", "unique:countries,country_name"],
                    "code" => ["required", "unique:countries,code"],
                    "prefix" => ["required", "unique:countries,prefix"],
                    "currency" => ["nullable"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "country_name" => ["required", Rule::unique("countries", "country_name")->ignore($country->id)],
                    "code" => ["required", Rule::unique("countries", "code")->ignore($country->id)],
                    "prefix" => ["required", Rule::unique("countries", "prefix")->ignore($country->id)],
                    "currency" => ["nullable"],
                ]);
            default:
                return null;
        }
    }
}
