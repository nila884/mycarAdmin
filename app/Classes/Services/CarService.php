<?php

namespace App\Classes\Services;

use App\Models\Car;
use App\Models\CarFeature;
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorReturn;

class CarService
{
    public function Index()
    {
        $car = Car::paginate(15);
        return $car;
    }

    public function Create(Request $request)
    {
        $validator = $this->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $categoryId = $request->category_id;
        $modelId    = $request->car_model_id;
        $fuelTypeId = $request->fuel_type_id;
        $versionId  = $request->version_id;
        // $engineId = $request->engine_id;
        $sellerId         = $request->seller_id;
        $mileage          = $request->mileage;
        $chassisNumber    = $request->chassis_number;
        $registrationYear = $request->registration_year;
        $manufactureYear  = $request->manufacture_year;
        $price            = $request->price;
        $color            = $request->color;
        $weight           = $request->weight;
        $dimensions       = $request->dimensions;
        $location         = $request->location;
        $doors            = $request->doors;
        $m3               = $request->m_3;
        // $wheelDriver = $request->wheel_driver;
        $modelCode        = $request->model_code;
        $engineSize       = $request->engine_size;
        $engineCode       = $request->engine_code;
        $steatingCapacity = $request->steating_capacity;
        $steating         = $request->streeting;
        $transmission     = $request->transmission;
        DB::beginTransaction();
        try {
            $car = Car::create([
                "car_model_id"      => $modelId,
                "category_id"       => $categoryId,
                "fuel_type_id"      => $fuelTypeId,
                "version_id"        => $versionId,
                "seller_id"         => $sellerId,
                "mileage"           => $mileage,
                "chassis_number"    => $chassisNumber,
                "registration_year" => $registrationYear,
                "manufacture_year"  => $manufactureYear,
                "price"             => $price,
                "color"             => $color,
                "weight"            => $weight,
                "dimensions"        => $dimensions,
                "location"          => $location,
                "doors"             => $doors,
                "m_3"               => $m3,
                // "wheel_driver" => $wheelDriver,
                "model_code"        => $modelCode,
                "engine_size"       => $engineSize,
                "engine_code"       => $engineCode,
                "steating_capacity" => $steatingCapacity,
                "streeting"         => $steating,
                "transmission"      => $transmission,
            ]);
            foreach ($request->features as $item => $value) {
                CarFeature::create([
                    "car_id"     => $car->id,
                    "feature_id" => $value,
                ]);
            }
            foreach ($request->imagesCars as $image) {
                $img = $car->id . '_' . $image->getClientOriginalName();
                // dd($img);
                $type = $image->getClientMimeType();
                $size = $image->getSize();
                $image->move(storage_path('app/public/img_car/'), $img);
                Image::create([
                    "car_id"     => $car->id,
                    "image_path" => $img,
                ]);
            }
            DB::commit();
            return $car;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    public function Update(Request $request, Car $car)
    {

        $categoryId = $request->category_id;
        $modelId    = $request->car_model_id;
        $fuelTypeId = $request->fuel_type_id;
        $versionId  = $request->version_id;
        // $engineId = $request->engine_id;
        $sellerId         = $request->seller_id;
        $mileage          = $request->mileage;
        $chassisNumber    = $request->chassis_number;
        $registrationYear = $request->registration_year;
        $manufactureYear  = $request->manufacture_year;
        $price            = $request->price;
        $color            = $request->color;
        $weight           = $request->weight;
        $dimensions       = $request->dimensions;
        $location         = $request->location;
        $doors            = $request->doors;
        $m3               = $request->m_3;
        // $wheelDriver = $request->wheel_driver;
        $modelCode        = $request->model_code;
        $engineSize       = $request->engine_size;
        $engineCode       = $request->engine_code;
        $steatingCapacity = $request->steating_capacity;
        $steating         = $request->streeting;
        $transmission     = $request->transmission;
        DB::beginTransaction();
        try {
            $car->update([
                "car_model_id"      => $modelId,
                "category_id"       => $categoryId,
                "fuel_type_id"      => $fuelTypeId,
                "version_id"        => $versionId,
                "seller_id"         => $sellerId,
                "mileage"           => $mileage,
                "chassis_number"    => $chassisNumber,
                "registration_year" => $registrationYear,
                "manufacture_year"  => $manufactureYear,
                "price"             => $price,
                "color"             => $color,
                "weight"            => $weight,
                "dimensions"        => $dimensions,
                "location"          => $location,
                "doors"             => $doors,
                "m_3"               => $m3,
                // "wheel_driver" => $wheelDriver,
                "model_code"        => $modelCode,
                "engine_size"       => $engineSize,
                "engine_code"       => $engineCode,
                "steating_capacity" => $steatingCapacity,
                "streeting"         => $steating,
                "transmission"      => $transmission,
            ]);

            if ($request->is_main) {
                $oldPrincipale = Image::where('car_id', $car->id)->where('is_main', 1)->first();
                if ($oldPrincipale != null) {
                    $oldPrincipale->update(
                        [
                            'is_main' => 0,
                        ]
                    );
                }
                $newPrincipale = Image::where('car_id', $car->id)->where('id', $request->is_main)->first();
                $newPrincipale->update(['is_main' => 1]);
            }

            if ($request->has('features')) {
                $car->features()->sync($request->features);
            }
            if ($request->has('imagesCars')) {
                foreach ($request->imagesCars as $key => $image) {
                    $img = $car->id . '_' . $image->getClientOriginalName();
                    $image->move(storage_path('app/public/img_car/'), $img);
                    $image = DB::table('images')
                        ->where('id', $key)
                        ->where('car_id', $car->id)
                        ->update([
                            'image_path' => trim(htmlentities($img)),
                        ]);
                }
            }

            // dd($car);
            DB::commit();
            return $car;
            //code...
        } catch (Exception $e) {
            dd([
                "error"   => $e->getMessage(),
                "car"     => $car,
                "request" => $request->all(),
                'line'    => $e->getLine(),
                'file'    => $e->getFile(),
                'trace'   => $e->getTraceAsString(),
            ])->setStatusCode(500, "Error in Car Update" . $e->getMessage() . $e->getLine() . $e->getFile() . $e->getTraceAsString());

            DB::rollBack();
        }
    }

    public function Delete(Car $car)
    {
        // Delete associated images
        foreach ($car->images as $image) {
            $imagePath = storage_path('app/public/img_car/' . $image->image_path);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        // Delete associated features
        foreach ($car->features as $feature) {
            $feature->delete();
        }
        // Delete the car
        $car->features()->detach();
        $car->images()->delete();
        return $car->delete();
    }

    public function DataValidation(Request $request, String $method, Car | bool $car = null): ValidatorReturn | null
    {
        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), [
                    "car_model_id"      => ["required", 'exists:car_models,id'],
                    "category_id"       => ["required", 'exists:categories,id'],
                    "fuel_type_id"      => ["required", 'exists:fuel_types,id'],
                    "version_id"        => ["required", 'exists:versions,id'],
                    "seller_id"         => ["required", 'exists:sellers,id'],
                    "mileage"           => ["required"],
                    "chassis_number"    => ["required"],
                    "color"             => ["required"],
                    "weight"            => ["required"],
                    "price"             => ["required"],
                    "transmission"      => ["required"],
                    "streeting"         => ["required"],
                    "steating_capacity" => ["required"],
                    "doors"             => ["required"],
                ]);
            case 'patch':
                return Validator::make($request->all(), [
                    "car_model_id"      => ["required", 'exists:car_models,id'],
                    "category_id"       => ["required", 'exists:categories,id'],
                    "fuel_type_id"      => ["required", 'exists:fuel_types,id'],
                    "version_id"        => ["required", 'exists:versions,id'],
                    "seller_id"         => ["required", 'exists:sellers,id'],
                    "mileage"           => ["required"],
                    "chassis_number"    => ["required"],
                    "registration_year" => ["nullable"],
                    "manufacture_year"  => ["nullable"],
                    "color"             => ["required"],
                    "weight"            => ["required"],
                    "price"             => ["required"],
                    "status"            => ["nullable"],
                    "transmission"      => ["required"],
                    "streeting"         => ["required", 'exists:sellers,id'],
                    "steating_capacity" => ["required"],
                    "engine_code"       => ["nullable"],
                    "engine_size"       => ["nullable"],
                    "model_code"        => ["nullable"],
                    "wheel_driver"      => ["nullable"],
                    "m_3"               => ["nullable"],
                    "doors"             => ["required"],
                    "dimensions"        => ["nullable"],
                    "location"          => ["nullable"],
                ]);
            default:
                return null;
        }
    }

    public function searchCarOnly(Request $request)
    {
        $query = Car::query();

        // 🔹 Filter by Type (Category)
        if ($request->has('type')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('category_name', 'LIKE', "%{$request->type}%");
            });
        }
        // 🔹 Filter by Make (Brand)
        if ($request->has('make')) {
            $query->whereHas('carModel.brand', function ($q) use ($request) {
                $q->where('brand_name', 'like', '%' . $request->make . '%');
            });
            // $query->whereHas('brand', function ($q) use ($request) {
            //     $q->where('brand_name', 'LIKE', "%{$request->make}%");
            // });
        }

        // 🔹 Filter by Model
        if ($request->has('model')) {
            $query->whereHas('carModel', function ($q) use ($request) {
                $q->where('model_name', 'LIKE', "%{$request->model}%");
            });
        }

        // 🔹 Filter by Year Range
        if ($request->has('year_min') && $request->has('year_max')) {
            $query->whereBetween('manufacture_year', [$request->year_min, $request->year_max]);
        } elseif ($request->has('year_min')) {
            $query->where('manufacture_year', '>=', $request->year_min);
        } elseif ($request->has('year_max')) {
            $query->where('manufacture_year', '<=', $request->year_max);
        }

        // 🔹 Filter by Price Range
        if ($request->has('price_min') && $request->has('price_max')) {
            $query->whereBetween('price', [$request->price_min, $request->price_max]);
        }

        // 🔹 Filter by Transmission Type
        if ($request->has('transmission')) {
            $query->where('transmission', 'LIKE', "%{$request->transmission}%");

            // $query->whereHas('carDetails', function ($q) use ($request) {
            //     $q->where('transmission', $request->transmission);
            // });
        }

        // 🔹 Filter by Fuel Type (From fuel_types)
        if ($request->has('fuel_type')) {
            $query->whereHas('fuelType', function ($q) use ($request) {
                $q->where('fuel_type', $request->fuel_type);
            });
        }

        // Get results with relationships
        $cars = $query->with(['fuelType', 'category', 'carModel', 'images', 'features'])->get();
        return $cars;
        // return response()->json($cars);
    }

    public function SearchV1($data, $query)
    {
        if (count($data) > 0) {  
            // 🔹 Filter by Type (Category)
            if ($type = $data['type'] ?? "") {
                $query->whereHas('category', function ($q) use ($data) {
                    $q->where('category_name', 'LIKE', '%' . $data['type'] . '%');
                });
            }
            // 🔹 Filter by Make (Brand)
            if ($make = $data['make'] ?? "") {
                $query->whereHas('carModel.brand', function ($q) use ($data) {
                    $q->where('brand_name', 'like', '%' . $data['make'] . '%');
                });
            }
            // 🔹 Filter by Model
            if ($model = $data['model'] ?? "") {
                $query->whereHas('carModel', function ($q) use ($data) {
                    $q->where('model_name', 'LIKE', "%{$data['model']}%");
                });
            }
            // 🔹 Filter by Year Range
            // dd($data);
            if ($year_min= $data['year_min'] ?? "" && $year_max= $data['year_max'] ?? "") {
                $query->whereBetween('manufacture_year', [$data['year_min'], $data['year_max']]);
            } elseif ($data['year_min'] ?? "") {
                $query->where('manufacture_year', '>=', $data['year_min']);
            } elseif ($data['year_max'] ?? "") {
                $query->where('manufacture_year', '<=', $data['year_max']);
            }

            // 🔹 Filter by Price Range
            if ($data['price_min'] ?? "" && $data['price_max'] ?? "") {
                $query->whereBetween('price', [$data['price_min'], $data['price_max']]);
            }

            // 🔹 Filter by Transmission Type
            if ($transmission = $data['transmission'] ?? "") {
                $query->where('transmission', 'LIKE', "%{$data['transmission']}%");

                // $query->whereHas('carDetails', function ($q) use ($request) {
                //     $q->where('transmission', $request->transmission);
                // });
            }

            // 🔹 Filter by Fuel Type (From fuel_types)
            if ($fuel_type = $data['fuel_type'] ?? "") {
                $query->whereHas('fuelType', function ($q) use ($data) {
                    $q->where('fuel_type', $data['fuel_type']);
                });
            }
        }
        return $query;
    }

    /**
     * SEARCH PARMS
     * 1 Maker -> Brand =>done
     * 2 Model =>done
     * 3 Year =>done
     * 4 Price =>done
     * 5 Type -> Category=>done
     * 6 steeting(volant lift)
     * 7 Fuel type =>done
     * 8 Transmission   =>done
     * 9 Mileage(Km run)
     * 10 Engine(cc power moter)
     * 10 color
     * 11 Seats
     * 12 Load Cap(poid Ton)
     * 13 Features
     * 1.list yama marque
     *2.list yama modeles d'une marque donnée (find models by id marque)
     *3.list yama series d'un model donné (find series by id model)
     *4.recommended cars(only 4 cars)
     */
}
