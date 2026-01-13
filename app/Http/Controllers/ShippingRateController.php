<?php
namespace App\Http\Controllers;



use App\Http\Controllers\Controller;
use App\Models\ShippingRate;
use App\Models\Country;
use App\Models\Port;
use App\Classes\Services\ShippingRateService;
use App\Http\Resources\ShippingRateResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\JsonResponse;

class ShippingRateController extends Controller
{
    protected $service;

    public function __construct(ShippingRateService $service)
    {
        $this->service = $service;
    }

    /**
     * Display the shipping rates list page
     */
    public function index()
    {
        return Inertia::render('shipping/prices/list', [
            'shipping_rates' => ShippingRateResource::collection( $this->service->Index()),
            'countries' => Country::orderBy('country_name')->get(),
            'ports' => Port::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a new shipping rate
     */
    public function store(Request $request)
    {
        $this->service->Create($request);

        return redirect()->back()->with('success', 'Shipping rate created successfully.');
    }

    /**
     * Update an existing shipping rate
     */
    public function update(Request $request, ShippingRate $shippingRate)
    {
        $this->service->Update($request, $shippingRate);

        return redirect()->back()->with('success', 'Shipping rate updated successfully.');
    }

    /**
     * Remove the shipping rate
     */
    public function destroy(ShippingRate $shippingRate)
    {
        $this->service->Delete($shippingRate);

        return redirect()->back()->with('success', 'Shipping rate deleted successfully.');
    }

    public function apiGetShippingRatesClient() :JsonResponse{
        $rates=ShippingRateResource::collection( $this->service->Index());
        return response()->json($rates);

    }
}