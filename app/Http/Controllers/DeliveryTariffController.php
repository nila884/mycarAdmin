<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DeliveryTariff;
use App\Models\Country;
use App\Models\Port;
use App\Classes\Services\DeliveryTariffService;
use App\Models\DeliveryDriverAgency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryTariffController extends Controller
{
    protected $service;

    public function __construct(DeliveryTariffService $service)
    {
        $this->service = $service;
    }

    /**
     * Display the delivery tariffs list page
     */
    public function index()
    {
        return Inertia::render('shipping/tariffs/list', [
            'delivery_tariffs' => $this->service->Index(),
            'countries' => Country::orderBy('country_name')->get(),
            'ports' => Port::orderBy('name')->get(),
            'agencies'=> DeliveryDriverAgency::all(),
        ]);
    }

    /**
     * Store a new delivery tariff
     */
    public function store(Request $request)
    {
        $this->service->Create($request);

        return redirect()->back()->with('success', 'Delivery tariff created successfully.');
    }

    /**
     * Update an existing delivery tariff
     */
    public function update(Request $request, DeliveryTariff $deliveryTariff)
    {
        $this->service->Update($request, $deliveryTariff);

        return redirect()->back()->with('success', 'Delivery tariff updated successfully.');
    }

    /**
     * Remove the delivery tariff
     */
    public function destroy(DeliveryTariff $deliveryTariff)
    {
        $this->service->Delete($deliveryTariff);

        return redirect()->back()->with('success', 'Delivery tariff deleted successfully.');
    }

    
}