<?php
namespace App\Http\Controllers;
use App\Models\Brand;
use App\Models\CarModel;

class CarMetaController extends Controller
{
    public function modelsByBrand(Brand $brand)
    {
        return response()->json(
            $brand->carModels()
                ->orderBy('model_name')
                ->get([
                    'id',
                    'model_name as label',
                    'brand_id',
                ])
        );
    }

    public function versionsByModel(CarModel $model)
    {
        return response()->json(
            $model->versions()
                ->orderBy('version_name')
                ->get([
                    'id',
                    'version_name as label',
                    'car_model_id as model_id',
                ])
        );
    }
}
