<?php
namespace App\Classes\Services;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator as ValidatorReturn;

Class BrandService
{
    public function Index()
    {
        $brand =  Brand::paginate(50);
        return $brand;
    }

    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->brand_name));
        if (array_key_exists('logo', $request->all())) {
            $logo= $name.'_' . $request->logo->getClientOriginalName();
            $type = $request->logo->getClientMimeType();
            $size = $request->logo->getSize();
            $request->logo->move(storage_path('app/public/logo/'), $logo);
        }
        return Brand::create([
            "brand_name" => $name,
            "logo"=>$logo
        ]);
    }

    public function Update(Request $request, Brand $brand): Brand
    {
        $name = trim(htmlspecialchars($request->brand_name));

        if (array_key_exists('logo', $request->all())) {
            $logo= $name.'_' . $request->logo->getClientOriginalName();
            $type = $request->logo->getClientMimeType();
            $size = $request->logo->getSize();
            $request->logo->move(storage_path('app/public/Logo/'), $logo);
            $brand->update([
                "brand_name" => $name,
                "logo"=>$logo

            ]);
        }else{
            $brand->update([
                "brand_name" => $name
            ]);
        }
        return $brand;
    }

    public function Delete(Brand $brand): bool
    {
        return $brand->delete();
    }


    public function DataValidation(Request $request, String $method, Brand|bool $brand = null): ValidatorReturn|null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "brand_name" => ["required", "unique:brands,brand_name"],
                    "logo"=>['nullable']

                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "brand_name" => ["required", Rule::unique("brands", "brand_name")->ignore($brand->id)],
                    "logo"=>['nullable']

                ]);
            default:
                return null;
        }
    }

}
