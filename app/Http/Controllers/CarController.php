<?php

namespace App\Http\Controllers;

use App\Classes\Services\CarService;
use App\Http\Resources\CarListingResource;
use App\Http\Resources\CarResource;
use App\Http\Resources\CarResourceManagement;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarModel;
use App\Models\Category;
use App\Models\Color;
use App\Models\Country;
use App\Models\Feature;
use App\Models\FuelType;
use App\Models\Seller;
use App\Models\Version;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;


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
    public function index(Request $request )
    {
        $deletedCars = Car::onlyTrashed()->get();
    $cars = $this->carService->Index();

    $cars->through(fn ($car) => new CarResourceManagement($car));

    return Inertia::render('car/list', [
        'cars' => $cars,
        'filters' => $request->only(
        'search',
        'sort',
        'direction',
        'publication_status',
        'car_selling_status',
        'discounted',
    ),
    ]);
    }

    public function searchByBrand(){
        $cars= $this->carService->searchByBrand();
        return Inertia::render('car/list', [
            'cars' => $cars->through(fn($car)=> new CarResourceManagement(($car)) ),
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
        $colors= Color::all(['id','name','hex_code']);
        $coutries= Country::all(['id','country_name']);
        $versions = Version::with('carModel:id,model_name')->get()->map(function ($version) {
            return [
                'id' => $version->id,
                'version_name' => $version->version_name,
                'version_year' => $version->version_year,
                'car_model_id' => $version->car_model_id,
                'model_name' => $version->carModel->model_name ?? 'N/A'];
        });

        return Inertia::render('car/create', [
            'brands' => $brands,
            'carModels' => $carModels,
            'categories' => $categories,
            'fuelTypes' => $fuelTypes,
            'versions' => $versions,
            'sellers' => $sellers,
            'features' => $features,
            'colors'=> $colors,
            'countries'=>$coutries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
          
        try {
          $car=  $this->carService->Create($request);
            return redirect()->route('car.index')
                ->with('success', 'Car created successfully!');
        } catch (ValidationException $e) {
            // Inertia automatically handles validation errors, but you can add custom logic
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create car. Please try again. Error: '.$e->getMessage()])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $car = $this->carService->read($id);
        if (! $car) {
            abort(404);
        }
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
        $versions = Version::all(['id', 'version_name', 'car_model_id', 'version_year']);
        $sellers = Seller::all(['id', 'seller_name']);
        $features = Feature::all(['id', 'feature_name']);
        $colors= Color::all(['id','name','hex_code']);
        $coutries= Country::all(['id','country_name']);
        // Fetch the car data including its relationships for pre-filling the form
        $carData = $this->carService->read($car->id);

        if (! $carData) {
            abort(404);
        }

        return Inertia::render('car/create', [ // Render the same create form for editing
            'car' => CarResourceManagement::make($carData), // Pass the car data to the frontend
            'brands' => $brands,
            'carModels' => $carModels,
            'categories' => $categories,
            'fuelTypes' => $fuelTypes,
            'versions' => $versions,
            'sellers' => $sellers,
            'features' => $features,
            'colors' => $colors,
            'countries'=>$coutries,
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
            return back()->withErrors(['general' => 'Failed to update car. Please try again. Error: '.$e->getMessage()])->withInput();
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
            return back()->withErrors(['general' => 'Failed to delete car. Please try again. Error: '.$e->getMessage()]);
        }
    }

    /**
     * Display a listing of all cars based on provided filters (brand, model, version).
     * All filters are optional query parameters.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
public function carsSearch(Request $request)
{
    $cars = Car::query()
        ->with([
            'version.carModel.brand',
            'category',
            'fuelType',
            'seller',
            'imageMain',
            'features',
            'currentPrice',
        ])
        ->visible()

        ->when($request->brand, fn ($q, $v) => $q->brand($v))
        ->when($request->model, fn ($q, $v) => $q->model($v))
        ->when($request->version, fn ($q, $v) => $q->version($v))
        ->when($request->category, fn ($q, $v) => $q->categories($v))
        ->when($request->fuel, fn ($q, $v) => $q->fuels($v))
        ->when($request->transmission, fn ($q, $v) => $q->transmission($v))
        ->when($request->steering, fn ($q, $v) => $q->steering($v))
        ->when(
            $request->price_min || $request->price_max,
            fn ($q) => $q->priceBetween(
                $request->price_min,
                $request->price_max
            )
        )
         ->when(
        $request->mileage_min || $request->mileage_max,
        fn ($q) => $q->mileageBetween(
            $request->mileage_min,
            $request->mileage_max
        )
    )
         ->when(
        $request->year_min || $request->year_max,
        fn ($q) => $q->manufacturedYearBetween(
            $request->year_min,
            $request->year_max
        )
    )
        ->sort($request->sort)
        ->select('cars.*')
        ->paginate(10);

    return CarListingResource::collection($cars);
}



    /**
     * Display a listing of all cars based on provided filters (brand, model, version).
     * All filters are optional query parameters.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function carsFilter(Request $request)
    {
        $brandId = $request->input('brand');
        $modelId = $request->input('model');
        $versionId = $request->input('version');
        $categoryIds = $request->query('category');
        $fuelTypeIds = $request->query('fuel');
        $transmission = $request->query('transmission');
        $steering = $request->query('steering');

        $query = Car::query();

        // Use 'with' to eagerly load the nested relationships to avoid N+1 issues
        $query->with(['version.carModel.brand', 'category', 'fuelType',  'seller', 'imageMain', 'features', 'currentPrice']);

        // Conditionally apply the brand filter if the brand name is provided.
        $query->when($brandId, function ($brandQuery) use ($brandId) {
            $brandQuery->whereHas('version.carModel.brand', function ($innerQuery) use ($brandId) {
                $innerQuery->where('id', $brandId);
            });
        });

        // Conditionally apply the car model filter if the model name is provided.
        $query->when($modelId, function ($modelQuery) use ($modelId) {
            $modelQuery->whereHas('version.carModel', function ($innerQuery) use ($modelId) {
                $innerQuery->where('id', $modelId);
            });
        });

        // Conditionally apply the version filter if the version name is provided.
        $query->when($versionId, function ($versionQuery) use ($versionId) {
            $versionQuery->whereHas('version', function ($innerQuery) use ($versionId) {
                $innerQuery->where('id', $versionId);
            });
        });

        $query->when($categoryIds, function ($categoryQuerry) use ($categoryIds) {
            $ids = explode(',', $categoryIds);
            $categoryQuerry->whereIn('category_id', $ids);
        });

        $query->when($fuelTypeIds, function ($fuelTypeQuerry) use ($fuelTypeIds) {
            $ids = explode(',', $fuelTypeIds);
            $fuelTypeQuerry->whereIn('fuel_type_id', $ids);
        });

        $query->when($transmission, function ($q) use ($transmission) {
            $q->where('transmission', 'LIKE', '%'.$transmission.'%');
        });

        $query->when($steering, function ($q) use ($steering) {
            $q->where('streering', 'LIKE', '%'.$steering.'%');
        });

        // Get the final collection of cars.
        $cars = $query->paginate(10);
        if ($cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the given filters.',
                    'data' => [],

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
        $query->with(['version.carModel.brand', 'imageMain',  'currentPrice']);
        $cars = $query->take(10)->get();
        if ($cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the home page.',
                    'data' => [],

                ], 200);
        }
        return CarListingResource::collection($cars);

    }

    /**
     * Display the details of a specific car.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Resources\Json\JsonResource
     */
    public function carDetail($id)
    {
    

        $car = Car::with(['version.carModel.brand','originCountry' ,'category', 'fuelType', 'seller', 'features', 'images', 'currentPrice'])
            ->find($id);

        if (! $car) {
            return response()->json(
                [
                    'message' => 'Car not found.',
                    'data' => [],
                ], 404
            );
        }

        return new CarResource($car);

    }

    /**
     * Display a listing of cars for the home page.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function carRecomended()
    {
        $query = Car::query();
        // Use 'with' to eagerly load the nested relationships to avoid N+1 issues
        $query->with(['version.carModel.brand',   'imageMain',  'currentPrice']);

        $cars = $query->take(4)->get();
        if ($cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the home page.',
                    'data' => [],

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
    public function carsHomeMobile()
    {

        $query = Car::query();
        // Use 'with' to eagerly load the nested relationships to avoid N+1 issues
        $query->with(['version.carModel.brand', 'imageMain',  'currentPrice']);

        $cars = $query->take(4)->get();
        if ($cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the home page.',
                    'data' => [],

                ], 200);
        }

        // Return a collection of CarResource instances.
        // return CarListingResource::collection($cars);
        return response()->json(
            [

                'carsRecomended' => CarListingResource::collection($cars),
                'carsNew' => CarListingResource::collection($cars),
                'carsRecentlyViewed' => CarListingResource::collection($cars),

            ], 200
        );

    }

    public function getCarsBySellerId($sellerId)
    {
        $cars = Car::with(['version.carModel.brand', 'seller', 'imageMain', 'currentPrice'])
            ->where('seller_id', $sellerId)
            ->get();

        if ($cars->isEmpty()) {
            return response()->json(
                [
                    'message' => 'No cars found for the given seller.',
                    'data' => [],
                ], 200
            );
        }

        return CarListingResource::collection($cars);

    }


    ///get deleted car for report
    public function getDeletedCar(){
        return response()->json( $deletedCars = Car::onlyTrashed()->get());
    }
}
