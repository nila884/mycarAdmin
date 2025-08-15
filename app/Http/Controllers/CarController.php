<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Car;
use App\Classes\Services\CarService;
use Illuminate\Validation\ValidationException;
use App\Models\Brand;
use App\Models\CarModel;
use App\Models\FuelType;
use App\Models\Version;
use App\Models\Seller;
use App\Models\Category;
use App\Models\Feature;
use App\Http\Resources\CarResource; 
use App\Http\Resources\CarListingResource;


class CarController extends Controller
{
    protected $carService;

    public function __construct(CarService $carService)
    {
        $this->carService = $carService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cars = $this->carService->Index();
        return Inertia::render('car/list', [
            'cars' => $cars,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch necessary data for dropdowns and checkboxes
        $brands = Brand::all(['id', 'brand_name']);
        $carModels = CarModel::all(['id', 'model_name', 'brand_id']);
        $categories = Category::all(['id', 'category_name']);
        $fuelTypes = FuelType::all(['id', 'fuel_type']);
        $sellers = Seller::all(['id', 'seller_name']);
        $features = Feature::all(['id', 'feature_name']);

            $versions = Version::with('carModel:id,model_name')->get()->map(function ($version) {
            return [
                'id' => $version->id,
                'version_name' => $version->version_name,
                'version_year' => $version->version_year,
                'car_model_id' => $version->car_model_id,
                'model_name' => $version->carModel->model_name ?? 'N/A'  ];
        });
        
        return Inertia::render('car/create', [
            'brands' => $brands,
            'carModels' => $carModels,
            'categories' => $categories,
            'fuelTypes' => $fuelTypes,
            'versions' => $versions,
            'sellers' => $sellers,
            'features' => $features,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       
        try {
            $this->carService->Create($request);
            return redirect()->route('car.index')
                             ->with('success', 'Car created successfully!');
        } catch (ValidationException $e) {
            // Inertia automatically handles validation errors, but you can add custom logic
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create car. Please try again. Error: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $car = $this->carService->read($id);
        if (!$car) {
            abort(404);
        }
        // You might render a 'car/show' page here if you have one
        return Inertia::render('car/show', ['car' => $car]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Car $car) // Laravel's Route Model Binding automatically resolves the Car instance
    {
        // Fetch necessary data for dropdowns and checkboxes, similar to create()
        $brands = Brand::all(['id', 'brand_name']);
        $carModels = CarModel::all(['id', 'model_name', 'brand_id']);
        $categories = Category::all(['id', 'category_name']);
        $fuelTypes = FuelType::all(['id', 'fuel_type']);
        $versions = Version::all(['id', 'version_name','car_model_id','version_year']);
        $sellers = Seller::all(['id', 'seller_name']);
        $features = Feature::all(['id', 'feature_name']);

        // Fetch the car data including its relationships for pre-filling the form
        $carData = $this->carService->read($car->id);
      
        if (!$carData) {
            abort(404);
        }
        return Inertia::render('car/create', [ // Render the same create form for editing
            'car' => $carData, // Pass the car data to the frontend
            'brands' => $brands,
            'carModels' => $carModels,
            'categories' => $categories,
            'fuelTypes' => $fuelTypes,
            'versions' => $versions,
            'sellers' => $sellers,
            'features' => $features,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Car $car)
    {
        try {
            $this->carService->update($request, $car);
            return redirect()->route('car.index')
                             ->with('success', 'Car updated successfully!');
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to update car. Please try again. Error: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Car $car)
    {
        try {
            $this->carService->delete($car);
            return redirect()->route('car.index')
                             ->with('success', 'Car deleted successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to delete car. Please try again. Error: ' . $e->getMessage()]);
        }
    }

      /**
     * Display a listing of all cars based on provided filters (brand, model, version).
     * All filters are optional query parameters.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function carsSearch(Request $request)
    {
        $brandName = $request->input('brand');
        $modelName = $request->input('model');
        $versionName = $request->input('version');

        $query = Car::query();

        // Use 'with' to eagerly load the nested relationships to avoid N+1 issues
        $query->with(['carModel.brand', 'category', 'fuelType', 'version', 'seller', 'images', 'features', 'prices']);
            
        // Conditionally apply the brand filter if the brand name is provided.
        $query->when($brandName, function ($brandQuery) use ($brandName) {
            $brandQuery->whereHas('carModel.brand', function ($innerQuery) use ($brandName) {
                $innerQuery->where('brand_name', $brandName);
            });
        });
            
        // Conditionally apply the car model filter if the model name is provided.
        $query->when($modelName, function ($modelQuery) use ($modelName) {
            $modelQuery->whereHas('carModel', function ($innerQuery) use ($modelName) {
                $innerQuery->where('model_name', $modelName);
            });
        });
        
        // Conditionally apply the version filter if the version name is provided.
        $query->when($versionName, function ($versionQuery) use ($versionName) {
            $versionQuery->whereHas('version', function ($innerQuery) use ($versionName) {
                $innerQuery->where('version_name', $versionName);
            });
        });

        // Get the final collection of cars.
        $cars = $query->get();
        if( $cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the given filters.',
                    'data'=>[]
            
            ], 200);
        }
        // Return a collection of CarResource instances.
        return CarListingResource::collection($cars);
    }

    /**
     * Display a listing of cars for the home page.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function carsHome()
    {
        $query = Car::query();
                // Use 'with' to eagerly load the nested relationships to avoid N+1 issues
        $query->with(['carModel.brand',  'version', 'carModel', 'images',  'prices']);
        
       $cars= $query->take(10)->get();
        if( $cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the home page.',
                    'data'=>[]
            
            ], 200);
        }
        // Return a collection of CarResource instances.
        return CarListingResource::collection($cars);


    }
    /**
     * Display the details of a specific car.
     *
     * @param int $id
     * @return \Illuminate\Http\Resources\Json\JsonResource
     */
    public function carDetail($id)
    {
              $car = Car::with(['carModel.brand', 'category', 'fuelType', 'version', 'seller', 'features', 'images', 'prices'] )
              ->find($id);
      
        if (!$car) {
            return response()->json(
                [
                    'message' => 'Car not found.',
                    'data' => []
                ], 404
            );
        }

        return new CarResource($car);
        
        
    }        
}
