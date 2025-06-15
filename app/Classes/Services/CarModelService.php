<?php

namespace App\Classes\Services;

use Carbon\Carbon;
use App\Models\carModel;
use Illuminate\Http\Request;

class carModelService
{
    public function Index()
    {
        $carModel =   carModel::paginate(15);
        return $carModel;
    }

    public function create(Request $request)
    {
        $name = trim(htmlspecialchars($request->model_name));
        $brandId = $request->brand_id;
        return carModel::create([
            "model_name" => $name,
            "brand_id" => $brandId
        ]);
    }

    public function read(int $id)
    {
        return carModel::find($id);
    }

    public function update(Request $request, carModel $carModel): carModel
    {
        $name = trim(htmlspecialchars($request->model_name));
        $brandId = $request->brand_id;
        $carModel->update([
            "model_name" => $name,
            "brand_id" => $brandId
        ]);
        return $carModel;
    }

    public function delete(carModel $carModel): bool
    {
        $carModel = carModel::find($carModel->id);

        if ($carModel) {
            // $carModel->brand->delete();
            $carModel->delete();
            return true;
        }
        return false;
    }

    public function getAll()
    {
        return carModel::all();
    }

    public function DataValidation(Request $request, String $method, carModel|bool $carModel = null): \Illuminate\Validation\Validator|null
    {
        switch (strtolower($method)) {
            case 'post':
                return \Illuminate\Support\Facades\Validator::make($request->all(), [
                    "model_name" => ["required", "unique:car_models,model_name"],
                    "brand_id" => ["required", "exists:brands,id"]
                ]);
            case 'patch':
                return \Illuminate\Support\Facades\Validator::make($request->all(), [
                    "model_name" => ["required", "unique:car_models,model_name," . $carModel->id],
                    "brand_id" => ["required", "exists:brands,id"]
                ]);
            default:
                return null;
        }
    }
}
