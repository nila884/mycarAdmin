<?php
namespace App\Http\Controllers;
use App\Models\Brand;
use App\Models\Car;
use App\Models\CarPrice;
use App\Models\Category;
use App\Models\Feature;
use App\Models\FuelType;

class CarFilterController extends Controller
{
    public function index()
    {
        return response()->json([
            'filters' => [
                'brand' => $this->brands(),
                'fuel' => $this->fuels(),
                'category' => $this->categories(),
                'transmission' => $this->transmission(),
                'steering' => $this->steering(),
                'price' => $this->priceRange(),
                'manifactured_year' => $this->manufacturedYearRange(),
                'feature'=> $this->features(),
                'mileage'=>$this->mileageRange(),
            ],
            'sort' => $this->sortOptions(),
            
        ]);
    }

    protected function brands()
    {
        return [
            'type' => 'select',
            'label' => 'Brand',
            'options' => Brand::orderBy('brand_name')
                ->get(['id', 'brand_name as label']),
        ];
    }

    protected function fuels()
    {
        return [
            'type' => 'multi',
            'label' => 'Fuel Type',
            'options' => FuelType::get(['id', 'fuel_type as label']),
        ];
    }

    protected function categories()
    {
        return [
            'type' => 'multi',
            'label' => 'Category',
            'options' => Category::get(['id', 'category_name as label']),
        ];
    }

    protected function transmission()
    {
        return [
            'type' => 'radio',
            'label' => 'Transmission',
            'options' => [
                ['value' => 'automatic', 'label' => 'Automatic'],
                ['value' => 'manual', 'label' => 'Manual'],
            ],
        ];
    }

    protected function steering()
    {
        return [
            'type' => 'radio',
            'label' => 'Steering',
            'options' => [
                ['value' => 'left', 'label' => 'Left'],
                ['value' => 'right', 'label' => 'Right'],
            ],
        ];
    }

    protected function priceRange()
    {
        $price = CarPrice::where('is_current', true)
            ->selectRaw('MIN(final_price) as min, MAX(final_price) as max')
            ->first();

        return [
            'type' => 'range',
            'label' => 'Price',
            'min' => (int) $price->min,
            'max' => (int) $price->max,
        ];
    }

        protected function mileageRange()
    {
        $mileage = Car::selectRaw('MIN(mileage) as min, MAX(mileage) as max')
            ->first();

        return [
            'type' => 'range',
            'label' => 'mileage',
            'min' => (int) $mileage->min,
            'max' => (int) $mileage->max,
        ];
    }

        // NEW: Manufactured Year
    protected function manufacturedYearRange()
    {
        $year = Car::selectRaw('MIN(manufacture_year) as min, MAX(manufacture_year) as max')
            ->first();

        return [
            'type' => 'range',
            'label' => 'Manufactured Year',
            'min' => (int) $year->min,
            'max' => (int) $year->max,
        ];
    }

    protected function features()
    {
          return [ 
            'type' => 'checkbox',
            'label' => 'Feature',

            'options' =>            Feature::where('is_main', true)
                        ->orderBy('feature_name', 'asc')
                        ->get(['id', 'icon','feature_name as name'])
          ];
    }

    protected function sortOptions()
    {
        return [
            ['value' => 'latest', 'label' => 'Newest'],
            ['value' => 'price_asc', 'label' => 'Price: Low → High'],
            ['value' => 'price_desc', 'label' => 'Price: High → Low'],
            ['value' => 'mileage_asc', 'label' => 'Mileage: Low → High'],
            ['value' => 'mileage_desc', 'label' => 'Mileage: High → Low'],
        ];
    }
}
