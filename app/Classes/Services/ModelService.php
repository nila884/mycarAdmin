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
        $brand =  Brand::paginate(15);
        return $brand;
    }

    public function Create(Request $request)
    {
        $name = trim(htmlspecialchars($request->category_name));
        return Brand::create([
            "brand_name" => $name,
        ]);
    }

    public function Update(Request $request, Brand $brand): Brand
    {
        $name = trim(htmlspecialchars($request->brand_name));
        $brand->update([
            "brand_name" => $name
        ]);
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
                    
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "brand_name" => ["required", Rule::unique("brands", "brand_name")->ignore($brand->id)],
                ]);
            default:
                return null;
        }
    }

}
