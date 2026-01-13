<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Country;
use App\Classes\Services\CountryService;
use App\Classes\Services\DeliveryTariffService;
use App\Http\Resources\CountryResource;
use App\Http\Resources\DeliveryTariffResource;
use Illuminate\Http\JsonResponse;
use App\Models\Port;
use App\Http\Resources\PortResource;
use App\Http\Resources\ShippingRateResource;
use App\Models\DeliveryTariff;
use App\Models\ShippingRate;

class ClientShippingController extends Controller
{

        protected $service;

    public function __construct(DeliveryTariffService $service)
    {
        $this->service = $service;
    }

    public function shippingDetails(): JsonResponse
    {
        $countries = CountryResource::collection( Country::orderBy('country_name', 'asc')->get());
        $ports = PortResource::collection( Port::orderBy('name', 'asc')->get());
        $shippingRates= ShippingRateResource::collection( ShippingRate::where('is_current', true)->get());

        dd($shippingRates);
        $deliveryTarrifs= DeliveryTariffResource::collection(
       DeliveryTariff::with([
            'country', 
            'originCountry', 
            'originPort', 
            'fromCity', 
            'toCity', 
            'deliveryDriverAgency'
        ])->get()
        );
         
        return response()->json([
            'countries' => $countries,
            'ports' => $ports,
            'shipping_rates'=>$shippingRates,
            'delivery_tarrifs'=>$deliveryTarrifs,

        ]);
    }
}