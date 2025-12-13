<?php

namespace App\Classes\Services;

use App\Models\Car;
// This model is for the pivot table directly, but Eloquent's sync handles it
use App\Models\CarPrice;
use App\Models\Feature; // Import CarPrice model
use App\Models\Image;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule; // Import Rule class for unique validation
use Illuminate\Validation\Validator as ValidatorReturn;

class CarService
{
    public function Index()
    {

        // Load relationships for display in the frontend
        $cars = Car::with([
            'version.carModel.brand',
            'category',
            'fuelType',
            'seller',
            'features',
            'images' => function ($query) {
                $query->where('is_main', true)->select('car_id', 'image_path'); // Eager load only the main image, selecting specific columns
            },
            'prices' => function ($query) {
                $query->where('is_current', true); // Eager load only the current price
            },
        ])->paginate(15);
        // Transform the collection for frontend consumption
        $cars->getCollection()->transform(function ($car) {
            return [
                'id' => $car->id,
                'brand_name' => $car->version->carModel->brand->brand_name ?? 'N/A', // Access nested relationships
                'model_name' => $car->version->carModel->model_name ?? 'N/A',
                'category' => $car->category->category_name ?? 'N/A', // Changed to 'category' for frontend consistency
                'category_id' => $car->category->id ?? 'N/A',
                'fuel_type' => $car->fuelType->fuel_type ?? 'N/A', // Changed to 'fuel_type'
                'version_name' => $car->version->version_name ?? 'N/A',
                'seller_name' => $car->seller->seller_name ?? 'N/A',
                'mileage' => $car->mileage,
                'chassis_number' => $car->chassis_number,
                'registration_year' => $car->registration_year,
                'manufacture_year' => $car->manufacture_year,
                'price' => (float) ($car->prices->first()->price ?? $car->price), // Get current price from car_prices table, fallback to car.price
                'promo' => (float) ($car->prices->first()->discount ?? $car->promo ?? 0), // Get discount from car_prices, fallback to car.promo
                'color' => $car->color,
                'weight' => $car->weight,
                'status' => (bool) $car->status, // Cast to boolean for frontend
                'transmission' => $car->transmission,
                'streering' => $car->streering,
                'steating_capacity' => $car->steating_capacity,
                'engine_code' => $car->engine_code,
                'engine_size' => $car->engine_size,
                'model_code' => $car->model_code,
                'wheel_driver' => $car->wheel_driver,
                'm_3' => $car->m_3,
                'doors' => $car->doors,
                'dimensions' => $car->dimensions,
                'location' => $car->location,
                'image_main' => $car->images->first()->image_path ?? '/storage/no-image.png', // Get image main paths
                'publication_status' => $car->publication_status ?? 'pending',
                'car_sells_status' => $car->car_sells_status ?? 'selling',
                'features' => $car->features->pluck('id')->toArray(), // Get feature IDs
                'created_at' => $car->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $car->updated_at->format('Y-m-d H:i:s'),
            ];
        });

        return $cars;
    }

    public function Create(Request $request)
    {
        $validator = $this->DataValidation($request, 'post');

        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        DB::beginTransaction(); // Start a transaction

        try {
            // Map frontend form field names to backend database column names
            $car = Car::create([

                'category_id' => $request->category_id,
                'fuel_type_id' => $request->fuel_type_id,
                'version_id' => $request->version_id,
                'seller_id' => $request->seller_id ?? 1, // Use provided seller_id or default
                'mileage' => $request->mileage,
                'chassis_number' => trim(htmlspecialchars($request->chassis_number)),
                'registration_year' => $request->registration_year,
                'manufacture_year' => $request->manufacture_year,
                'color' => trim(htmlspecialchars($request->color)),
                'weight' => $request->weight,
                'status' => $request->boolean('status'), // Ensure boolean
                'transmission' => trim(htmlspecialchars($request->transmission)),
                'streering' => trim(htmlspecialchars($request->streering)),
                'steating_capacity' => $request->steating_capacity,
                'engine_code' => trim(htmlspecialchars($request->engine_code)),
                'engine_size' => $request->engine_size,
                'model_code' => trim(htmlspecialchars($request->model_code)),
                'wheel_driver' => trim(htmlspecialchars($request->wheel_driver)),
                'm_3' => $request->m_3,
                'doors' => $request->doors,
                'dimensions' => $request->dimensions, // Assuming dimensions might be JSON string
                'location' => trim(htmlspecialchars($request->location)),
                'publication_status' => trim(htmlspecialchars($request->publication_status)),
                'car_sells_status' => trim(htmlspecialchars($request->car_sells_status)),
            ]);

            // --- Handle Car Price ---
            CarPrice::create([
                'car_id' => $car->id,
                'price' => $request->price,
                'discount' => $request->promo ?? null, // 'promo' from frontend maps to 'discount'
                'discount_type' => $request->promo ? 'amount' : null, // Assuming promo is an amount
                'is_current' => true,
            ]);

            // --- Handle Main Image (if 'image' field is for a single main image) ---
            if ($request->hasFile('image')) {
                $imageFile = $request->file('image');
                $imageName = time().'_'.uniqid().'.'.$imageFile->getClientOriginalExtension();
                $path = $imageFile->storeAs('cars', $imageName, 'public');

                $car->images()->create([
                    'image_path' => Storage::url($path),
                    'is_main' => true, // Mark as main image
                ]);
            }

            // --- Handle Multiple Images ---
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
            DB::rollBack();
            throw $e;
        }
    }

    public function read(int $id)
    {

        $car = Car::with(['version.carModel.brand', 'category', 'fuelType', 'seller', 'features', 'images', 'prices' => function ($query) {
            $query->where('is_current', true);
        }])->find($id);

        if (! $car) {
            return null;
        }
        $transformedCar = [
            'id' => $car->id,
            'brand_name' => $car->version->carModel->brand->brand_name ?? 'N/A',
            'car_brand_id' => $car->version->carModel->brand->id,
            'version_id' => $car->version->id,
            'seller_id' => $car->seller->id,
            'fuel_type_id' => $car->fuelType->id,
            'model_name' => $car->version->carModel->model_name ?? 'N/A',
            'category' => $car->category->category_name ?? 'N/A',
            'category_id' => $car->category->id ?? 'N/A',
            'fuel_type' => $car->fuelType->fuel_type ?? 'N/A',
            'version_name' => $car->version->version_name ?? 'N/A',
            'seller_name' => $car->seller->seller_name ?? 'N/A',
            'mileage' => $car->mileage,
            'chassis_number' => $car->chassis_number,
            'registration_year' => $car->registration_year,
            'manufacture_year' => $car->manufacture_year,
            'price' => (float) ($car->prices->first()->price ?? $car->price),
            'promo' => (float) ($car->prices->first()->discount ?? $car->promo ?? 0),
            'color' => $car->color,
            'weight' => $car->weight,
            'status' => (bool) $car->status, // Cast to boolean for frontend
            'transmission' => $car->transmission,
            'streering' => $car->streering,
            'steating_capacity' => $car->steating_capacity,
            'engine_code' => $car->engine_code,
            'engine_size' => $car->engine_size,
            'model_code' => $car->model_code,
            'wheel_driver' => $car->wheel_driver,
            'm_3' => $car->m_3,
            'doors' => $car->doors,
            'dimensions' => $car->dimensions,
            'location' => $car->location,
            'publication_status' => $car->publication_status ?? 'pending',
            'car_sells_status' => $car->car_sells_status ?? 'selling',
            'features' => $car->features,
            'created_at' => $car->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $car->updated_at->format('Y-m-d H:i:s'),
            'image_url' => $car->images->where('is_main', true)->first()->image_path ?? null, // Get main image URL
            'images' => $car->images->where('is_main', false)->pluck('id', 'image_path')->toArray(), // Get additional image URLs
            'existing_images' => $car->images->where('is_main', false)->values(),
        ];

        return $transformedCar;
    }

    public function update(Request $request, Car $car): Car
    {
        $validator = $this->DataValidation($request, 'patch', $car);
        if ($validator->fails()) {
            throw new \Illuminate\Validation\ValidationException($validator);
        }

        DB::beginTransaction(); // Start a transaction

        try {
            // Map frontend form field names to backend database column names
            $car->update([
                'category_id' => $request->category_id,
                'fuel_type_id' => $request->fuel_type_id,
                'version_id' => $request->version_id,
                'seller_id' => $request->seller_id ?? 1,
                'mileage' => $request->mileage,
                'chassis_number' => trim(htmlspecialchars($request->chassis_number)),
                'registration_year' => $request->registration_year,
                'manufacture_year' => $request->manufacture_year,
                'color' => trim(htmlspecialchars($request->color)),
                'weight' => $request->weight,
                'status' => $request->boolean('status'),
                'transmission' => trim(htmlspecialchars($request->transmission)),
                'streering' => trim(htmlspecialchars($request->streering)),
                'steating_capacity' => $request->steating_capacity,
                'engine_code' => trim(htmlspecialchars($request->engine_code)),
                'engine_size' => $request->engine_size,
                'model_code' => trim(htmlspecialchars($request->model_code)),
                'wheel_driver' => trim(htmlspecialchars($request->wheel_driver)),
                'm_3' => $request->m_3,
                'doors' => $request->doors,
                'dimensions' => $request->dimensions, // Assuming dimensions might be JSON string
                'location' => trim(htmlspecialchars($request->location)),
                'publication_status' => trim(htmlspecialchars($request->publication_status)),
                'car_sells_status' => trim(htmlspecialchars($request->car_sells_status)),
            ]);

            // --- Handle Car Price Update ---
            // Deactivate current price
            $car->prices()->update(['is_current' => false]);
            // Create new current price
            CarPrice::create([
                'car_id' => $car->id,
                'price' => $request->price,
                'discount' => $request->promo ?? null,
                'discount_type' => $request->promo ? 'amount' : null,
                'is_current' => true,
            ]);

            // --- Handle Main Image Update ---
            // If a new main image is uploaded, delete the old main image and save the new one
            if ($request->hasFile('image')) {
                // Delete old main image from storage and DB
                $oldMainImage = $car->images()->where('is_main', true)->first();
                if ($oldMainImage) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $oldMainImage->image_path));
                    $oldMainImage->delete();
                }

                // Upload new main image
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
                        ->where('is_main', false) // Ensure we only delete additional images
                        ->first();
                    if ($image) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
                        $image->delete();
                    }
                }
            }

            // if ($request->hasFile('images')) { // Consider a separate field for images to delete
            //     // Delete all existing non-main images for this car
            //     $existingAdditionalImages = $car->images()->where('is_main', false)->get();
            //     foreach ($existingAdditionalImages as $image) {
            //         Storage::disk('public')->delete(str_replace('/storage/', '', $image->image_path));
            //         $image->delete();
            //     }
            // }
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
            DB::rollBack(); // Rollback on error
            throw $e; // Re-throw the exception
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
            'seller_id' => ['required', 'exists:sellers,id'], // Assuming seller_id is always sent
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
            'price' => ['required', 'numeric', 'min:0'], // Price is now handled in car_prices table
            'promo' => ['nullable', 'numeric', 'min:0'], // Promo is now handled as discount in car_prices
            'color' => ['required', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'status' => ['nullable', 'boolean'], // Frontend sends true/false based on 'new'/'used'
            'transmission' => ['required', 'string', 'max:255', 'in:automatic,manual'],
            'streering' => ['required', 'in:right,left'],
            'steating_capacity' => ['required', 'numeric', 'min:1', 'max:100'],
            'engine_code' => ['nullable', 'string', 'max:255'],
            'engine_size' => ['nullable', 'numeric', 'min:0', 'max:10000'],
            'model_code' => ['nullable', 'string', 'max:255'],
            'wheel_driver' => ['nullable', 'string', 'max:255', 'in:fwd,rwd,awd'],
            'm_3' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'doors' => ['nullable', 'integer', 'min:1', 'max:10'],
            'location' => ['nullable', 'string', 'max:255'],
            'publication_status' => ['required', 'in:published,pending,archived'],
            'car_sells_status' => ['required', 'in:sold,selling,reserved'], // New field for selling status

            // Main image
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:1024'], // Single main image, 1MB max

            // Additional images
            'images' => ['nullable', 'array', 'max:6'], // Array of images, max 6 files
            'images.*' => ['image', 'mimes:png,jpg,jpeg', 'max:2048'], // Each image max 2MB
            'images_to_delete' => ['nullable', 'array'], // Array of image IDs to delete
            'images_to_delete.*' => ['integer', 'exists:images,id'], // Each element must be an integer and exist in images table

            'features' => ['nullable', 'array'],
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
