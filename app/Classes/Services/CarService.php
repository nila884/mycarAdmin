<?php

namespace App\Classes\Services;

use App\Http\Resources\CarResourceManagement;
use App\Models\Car;
// This model is for the pivot table directly, but Eloquent's sync handles it
use App\Models\CarPrice;
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule; // Import Rule class for unique validation
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator as ValidatorReturn;

class CarService
{

    /**
 * Verifies profit margin. 
 * Handles cases with and without discounts.
 */
private function verifyProfitMargin($costPrice, $minMargin, $price, $discount, $discountType)
{
    $discountValue = $discount ?? 0;
    
    // 1. Calculate FOB Price
    // If discount is 0 or null, fobPrice is just the base price.
    if ($discountValue > 0 && !empty($discountType)) {
        $fobPrice = ($discountType === 'percent') 
            ? $price - ($price * ($discountValue / 100))
            : $price - $discountValue;
    } else {
        $fobPrice = $price;
    }

    // 2. Margin Guard
    $requiredMinimum = ($costPrice ?? 0) + ($minMargin ?? 0);

    if ($fobPrice < $requiredMinimum) {
        throw new \Exception(
            "Price Protection: The final price (US$ " . number_format($fobPrice, 2) . 
            ") is too low. Minimum required: US$ " . number_format($requiredMinimum, 2)
        );
    }
    
    return $fobPrice;
}


  public function Index()
{
    $query = Car::query()
        ->select('cars.*') 
        ->with([
            'version.carModel.brand',
            'category',
            'exteriorColor',
            'interiorColor',
            'fuelType',
            'seller',
            'features',
            'images',
            'originCountry',
            'currentPrice' => fn ($q) => $q->where('is_current', true),
        ])
        ->leftJoin('versions', 'cars.version_id', '=', 'versions.id')
        ->leftJoin('car_models', 'versions.car_model_id', '=', 'car_models.id')
        ->leftJoin('brands', 'car_models.brand_id', '=', 'brands.id')

        ->leftJoinSub(
            CarPrice::select('car_id', 'price')
                ->where('is_current', true),
            'current_prices',
            'current_prices.car_id',
            '=',
            'cars.id'
        );


    if ($search = request('search')) {
        $query->where('brands.brand_name', 'like', "%{$search}%")
        ->orWhereHas('version.carModel', fn ($m) =>
                $m->where('model_name', 'like', "%{$search}%")
            );
    }

    if ($publicationStatus = request('publication_status')) {
        $query->where('cars.publication_status', $publicationStatus);
    }

    if ($sellingStatus = request('car_selling_status')) {
        $query->where('cars.car_selling_status', $sellingStatus);
    }

    if ($status = request('status')) {
        $query->where('cars.status', $status);
    }

        if (request('discounted')) {
            $query->whereExists(function ($q) {
                $q->selectRaw(1)
                ->from('car_prices')
                ->whereColumn('car_prices.car_id', 'cars.id')
                ->where('car_prices.is_current', true)
                ->whereNotNull('car_prices.discount')
                ->where('car_prices.discount', '>', 0);
            });
        }

    if ($sorts = request('sort')) {
        $sorts = json_decode($sorts, true) ?? [];

        foreach ($sorts as $sort) {
            $direction = $sort['desc'] ? 'desc' : 'asc';

            match ($sort['id']) {
                'brand' =>
                    $query->orderBy('brands.brand_name', $direction),

                'model' =>
                    $query->orderBy('car_models.model_name', $direction),

                'price' =>
                    $query->orderBy('current_prices.price', $direction),

                'status' =>
                    $query->orderBy('cars.status', $direction),

                'publication_status' =>
                    $query->orderBy('cars.publication_status', $direction),

                'selling_status' =>
                    $query->orderBy('cars.car_selling_status', $direction),

                'created_at' =>
                    $query->orderBy('cars.created_at', $direction),

                'updated_at' =>
                    $query->orderBy('cars.updated_at', $direction),

                default => null,
            };
        }
    } else {
        $query->orderByDesc('cars.created_at');
    }

    return $query
        ->paginate(15)
        ->withQueryString();
}




    public function searchByBrand(){
        $query = Car::query();
        $query->with(['version.carModel.brand', 'category', 'fuelType',  'seller', 'images', 'features', 'currentPrice']);
        $query->whereHas('version.carModel.brand', function ($q) {
            $q->where('brand_name', 'like', '%' . request('search') . '%');
        });
        return $query->paginate(15);
    }


    public function Create(Request $request)
    {
        $validator = $this->DataValidation($request, 'post');
        
        if ($validator->fails()) {
         
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        $this->verifyProfitMargin(
            $request->cost_price,
            $request->min_profit_margin,
            $request->price,
            $request->discount, // Passed even if null
            $request->discount_type // Passed even if null
        );

        DB::beginTransaction();
        try {
            $car = Car::create([
                 'car_model_id'=> $request->car_model_id,
                'car_brand_id'=> $request->car_brand_id,
                'category_id' => $request->category_id,
                'fuel_type_id' => $request->fuel_type_id,
                'version_id' => $request->version_id,
                'seller_id' => $request->seller_id,
                'mileage' => $request->mileage,
                'cost_price' => $request->cost_price,
                 'min_profit_margin' => $request->min_profit_margin ?? 0,
                'origin_country_id'=> $request->origin_country_id,
                'chassis_number' => trim(htmlspecialchars($request->chassis_number)),
                'registration_year' => $request->registration_year,
                'manufacture_year' => $request->manufacture_year,
                'interior_color_id' => $request->interior_color_id,
                'exterior_color_id' => $request->exterior_color_id,
                'weight' => $request->weight,
                'status' => $request->status,
                'transmission' => trim(htmlspecialchars($request->transmission)),
                'steering' => trim(htmlspecialchars($request->steering)),
                'seating_capacity' => $request->seating_capacity,
                'engine_code' => trim(htmlspecialchars($request->engine_code)),
                'engine_size' => $request->engine_size,
                'model_code' => trim(htmlspecialchars($request->model_code)),
                'wheel_driver' => trim(htmlspecialchars($request->wheel_driver)),
                'm_3' => $request->m_3,
                'doors' => $request->doors,
                'dimensions' => $request->dimensions, // Assuming dimensions might be JSON string
                'location' => trim(htmlspecialchars($request->location)),
                'publication_status' => trim(htmlspecialchars($request->publication_status)),
                'car_selling_status' => trim(htmlspecialchars($request->car_selling_status)),
            ]);
            CarPrice::create([
                'car_id' => $car->id,
                'price' => $request->price,
                'discount' => $request->discount ?? null,
                'discount_type' => $request->discount_type?? null,
                'is_current' => true,
            ]);

            

            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $imageName = time().'_'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('cars', $imageName, 'public');
                $car->images()->create([
                    'image_path' => Storage::url($path),
                    'is_main' => true, // Mark as main image
                ]);
            }
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $imageName = time().'_'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                    $path = $imageFile->storeAs('cars', $imageName, 'public');
                    $car->images()->create([
                        'image_path' => Storage::url($path),
                        'is_main' => false, // Mark as additional image
                    ]);
                }
            }

            $selectedFeatureIds = [];
            foreach ($request->input('features', []) as $feature) {

                $selectedFeatureIds[] = $feature['id'];

            }
            if (! empty($selectedFeatureIds)) {
                $car->features()->sync($selectedFeatureIds);
            } else {
                $car->features()->detach();
            }

            DB::commit();

            return $car;
        } catch (Exception $e) {
            dd($e);
            DB::rollBack();
            throw $e;
        }
    }

    public function read(int $id)
    {

        $car = Car::with(['version.carModel.brand', 'category','exteriorColor','interiorColor', 'originCountry','fuelType', 'seller', 'features', 'images','currentPrice' => function ($query) {
            $query->where('is_current', true);}])->find($id);
        if (! $car) {
            return null;
        }
        return CarResourceManagement::make($car);
    }

    public function update(Request $request, Car $car): Car
    {
        $validator = $this->DataValidation($request, 'patch', $car);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
           $this->verifyProfitMargin(
    $request->has('cost_price') ? $request->cost_price : $car->cost_price,
    $request->has('min_profit_margin') ? $request->min_profit_margin : $car->min_profit_margin,
    $request->price,
    $request->discount,
    $request->discount_type
);
        DB::beginTransaction();
        try {

            $car->update([


                'category_id' => $request->category_id,
                'fuel_type_id' => $request->fuel_type_id,
                'version_id' => $request->version_id,
                'seller_id' => $request->seller_id ?? 1,
                'mileage' => $request->mileage,
                'chassis_number' => trim(htmlspecialchars($request->chassis_number)),
                'registration_year' => $request->registration_year,
                'manufacture_year' => $request->manufacture_year,
                'exterior_color_id' => $request->exterior_color_id,
                'interior_color_id' => $request->interior_color_id,
                'cost_price' => $request->cost_price,
                 'min_profit_margin' => $request->min_profit_margin ?? 0,
                'weight' => $request->weight,
                'status' => $request->status,
                'origin_country_id'=> $request->origin_country_id,
                'transmission' => trim(htmlspecialchars($request->transmission)),
                'steering' => trim(htmlspecialchars($request->steering)),
                'seating_capacity' => $request->seating_capacity,
                'engine_code' => trim(htmlspecialchars($request->engine_code)),
                'engine_size' => $request->engine_size,
                'model_code' => trim(htmlspecialchars($request->model_code)),
                'wheel_driver' => trim(htmlspecialchars($request->wheel_driver)),
                'm_3' => $request->m_3,
                'doors' => $request->doors,
                'dimensions' => $request->dimensions, // Assuming dimensions might be JSON string
                'location' => trim(htmlspecialchars($request->location)),
                'publication_status' => trim(htmlspecialchars($request->publication_status)),
                'car_selling_status' => trim(htmlspecialchars($request->car_selling_status)),
            ]);

        
            // Deactivate current price
            $car->prices()->update(['is_current' => false]);
            // Create new current price
            CarPrice::create([
                'car_id' => $car->id,
                'price' => $request->price,
                'discount' => $request->discount ?? null,
                'discount_type' => $request->discount_type,
                'is_current' => true,
            ]);

            if ($request->hasFile('image')) {
                $oldMainImage = $car->images()->where('is_main', true)->first();
                if ($oldMainImage) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $oldMainImage->image_path));
                    $oldMainImage->delete();
                }

                $imageFile = $request->file('image');
                $imageName = time().'_'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('cars', $imageName, 'public');
                $car->images()->create([
                    'image_path' => Storage::url($path),
                    'is_main' => true,
                ]);
            } elseif ($request->input('clear_main_image')) { // Frontend sends a flag to clear main image
                $oldMainImage = $car->images()->where('is_main', true)->first();
                if ($oldMainImage) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $oldMainImage->image_path));
                    $oldMainImage->delete();
                }
            }

            if ($request->has('images_to_delete') && is_array($request->input('images_to_delete'))) {
                foreach ($request->input('images_to_delete') as $imageIdToDelete) {
                    $image = Image::where('id', $imageIdToDelete)
                        ->where('car_id', $car->id)
                        ->where('is_main', false) 
                        ->first();
                    if ($image) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                        $image->delete();
                    }
                }
            }

            // Upload new additional images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $imageName = time().'_'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                    $path = $imageFile->storeAs('cars', $imageName, 'public');
                    $car->images()->create([
                        'image_path' => Storage::url($path),
                        'is_main' => false,
                    ]);
                }
            }
            $selectedFeatureIds = [];
            foreach ($request->input('features', []) as $feature) {

                $selectedFeatureIds[] = $feature['id'];

            }
            if (! empty($selectedFeatureIds)) {
                $car->features()->sync($selectedFeatureIds);
            } else {
                $car->features()->detach();
            }

            DB::commit(); // Commit the transaction

            return $car;
        } catch (Exception $e) {
           
            DB::rollBack(); 
            throw $e; 
        }
    }

    public function delete(Car $car): bool
    {
        DB::beginTransaction(); // Start a transaction

        try {
            // Delete associated images from storage and DB
            foreach ($car->images as $image) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                $image->delete();
            }

            // Delete associated prices
            $car->prices()->delete();

            // Detach features
            $car->features()->detach();

            $car->delete(); // Delete the car record
            DB::commit(); // Commit the transaction

            return true;
        } catch (Exception $e) {
            DB::rollBack(); // Rollback on error
            throw $e; // Re-throw the exception
        }
    }

    public function DataValidation(Request $request, string $method, Car|bool|null $car = null): ?ValidatorReturn
    {
        
        $currentYear = date('Y');
        $rules = [
            'category_id' => ['required', 'exists:categories,id'],
            'fuel_type_id' => ['required', 'exists:fuel_types,id'],
            'version_id' => ['required', 'exists:versions,id'],
            'car_brand_id' => ['required', 'exists:brands,id'],
            'seller_id' => ['nullable', 'exists:sellers,id'], 
            'interior_color'=> ['nullable','exists:colors,id'],
            'exterior_color'=> ['nullable','exists:colors,id'],
            'mileage' => ['required', 'numeric', 'min:0'],
            'chassis_number' => ['required', 'string', 'max:255', 'unique:cars,chassis_number'],
            'registration_year' => [
                'nullable',
                'numeric',
                'digits:4',
                'min:1900',
                'max:'.($currentYear + 1),
                function ($attribute, $value, $fail) use ($request) {
                    $manufactureYear = $request->input('manufacture_year');
                    if (! is_null($value) && ! is_null($manufactureYear)) {
                        if ((int) $value < (int) $manufactureYear) {
                            $fail('The registration year cannot be before the manufacture year.');
                        }
                    }
                },
            ],
            'manufacture_year' => ['nullable', 'numeric', 'min:1900', 'digits:4', 'max:'.$currentYear],
            'price' => ['required', 'numeric', 'min:0'], 
            'discount_type' => ['nullable', 'required_with:discount_type', 'in:amount,percent'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'status' => ['required', 'in:new,used'], 
            'transmission' => ['required', 'string', 'max:255', 'in:automatic,manual'],
            'steering' => ['required', 'in:right,left'],
            'seating_capacity' => ['required', 'numeric', 'min:1', 'max:100'],
            'engine_code' => ['nullable', 'string', 'max:255'],
            'engine_size' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'model_code' => ['nullable', 'string', 'max:255'],
            'wheel_driver' => ['nullable', 'string', 'max:255', 'in:fwd,rwd,awd'],
            'm_3' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'doors' => ['nullable', 'integer', 'min:1', 'max:10'],
            'location' => ['nullable', 'string', 'max:255'],
            'publication_status' => ['required', 'in:published,pending,archived'],
            'car_selling_status' => ['required', 'in:sold,selling,reserved'], 
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024'], 
            'images' => ['nullable', 'array', 'max:6'], 
            'images.*' => ['image', 'mimes:png,jpg,jpeg', 'max:2048'],
            'images_to_delete' => ['nullable', 'array'], 
            'images_to_delete.*' => ['integer', 'exists:images,id'], 
            'cost_price' => 'required|numeric|min:0',
             'min_profit_margin' => 'nullable|numeric|min:0',
            'features' => ['nullable', 'array'],
              'dimensions'           => 'nullable|array',
                'dimensions.width_mm'  => 'nullable|integer|min:1',
                'dimensions.height_mm' => 'nullable|integer|min:1',
                'dimensions.length_mm' => 'nullable|integer|min:1',
            'origin_country_id' => ['required', 'exists:countries,id']
        ];

        switch (strtolower($method)) {
            case 'post':
                return Validator::make($request->all(), $rules);
            case 'patch':
                $rules['chassis_number'] = ['required', 'string', 'max:255', Rule::unique('cars', 'chassis_number')->ignore($car->id)];

                return Validator::make($request->all(), $rules);
            default:
                return null;
        }
    }
}
