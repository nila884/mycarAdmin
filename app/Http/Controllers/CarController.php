<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Car;
use App\Classes\Services\CarService;
use Illuminate\Validation\ValidationException;

// Import all models needed for dropdowns/checkboxes
use App\Models\Brand;
use App\Models\CarModel;
use App\Models\FuelType;
use App\Models\Version;
use App\Models\Seller;
use App\Models\Category;
use App\Models\Feature;


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
        // This method is typically for viewing a single resource in detail.
        // For Inertia CRUD, the 'edit' method often serves to fetch data for pre-filling a form.
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
}
