<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Country;
use App\Classes\Services\CountryService;
use App\Http\Resources\CountryResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use App\Models\Port;
use App\Http\Resources\PortResource;
use App\Models\DeliveryTariff;
use App\Models\ShippingRate;

class CountryController extends Controller
{
    protected $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }

    public function index()
    {
       
        return Inertia::render('shipping/countries/list', [
            'countries' => $this->countryService->Index(),
            'ports' => PortResource::collection(Port::all()),
        ]);
    }

    public function store(Request $request)
    {
       
        // Note: For file uploads, the frontend must submit using POST with the correct file data.
        $validator = $this->countryService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->countryService->Create($request);
        return redirect()->back()->with('success', 'Country created successfully!');
    }

    public function update(Request $request, Country $country)
    {
        // For file uploads on update, ensure method spoofing is used from frontend.
        $validator = $this->countryService->DataValidation($request, 'patch', $country);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->countryService->Update($request, $country);
        return redirect()->back()->with('success', 'Country updated successfully!');
    }

    public function destroy(Country $country)
    {
        $this->countryService->Delete($country);
        return redirect()->route('country.index')->with('success', 'Country deleted successfully!');
    }

    public function apiIndex(): JsonResponse
    {
        $countries = Country::orderBy('country_name', 'asc')->get();
        return CountryResource::collection($countries)->response();
    }

    // public function shippingDetails(): JsonResponse
    // {
    //     $countries = Country::orderBy('country_name', 'asc')->get();
    //     $ports =Port::orderBy('name', 'asc')->get();
    //     $shippingRates= ShippingRate::where('is_current', true)->get();
    //     $deliveryTarrifs= DeliveryTariff::all();
         
    //     return response()->json([
    //         'countries' => CountryResource::collection($countries),
    //         'ports' => PortResource::collection($ports),
    //         'shipping_rates'=>$shippingRates,
    //         'delivery_tarrifs'=>$deliveryTarrifs,

    //     ]);
    // }

    public function updateGateways(Request $request, $id)
    {
        $request->validate([
            'port_ids' => 'array',
            'port_ids.*' => 'exists:ports,id',
        ]);
        $this->countryService->setCountryGatewayPort($id, $request->port_ids);

        return back()->with('success', 'Gateway network updated.');
    }

    public function apiGetCountriesClient():JsonResponse{
        $countries= CountryResource::collection( Country::with('gatewayPorts')->orderBy('country_name', 'asc')->get());
        return response()->json($countries);
    }
}