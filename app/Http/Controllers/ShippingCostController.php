<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ShippingCost;
use App\Classes\Services\ShippingCostService;
use App\Http\Resources\ShippingCostResource;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\PortResource;

class ShippingCostController extends Controller
{
    protected $shippingCostService;

    public function __construct(ShippingCostService $shippingCostService)
    {
        $this->shippingCostService = $shippingCostService;
    }

    public function index()
    {
        
        $costs = ShippingCostResource::collection($this->shippingCostService->Index())->resolve();;
       $ports= PortResource::collection($this->shippingCostService->GetAllPorts())->resolve();
        return Inertia::render('shipping/prices/list', [
            'costs' => $costs,
            'ports' => $ports,
        ]);
    }

    public function store(Request $request)
    {
        $validator = $this->shippingCostService->DataValidation($request, 'post');
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->shippingCostService->Create($request);
        return redirect()->route('shipping.index')->with('success', 'Shipping cost created successfully!');
    }

    public function update(Request $request, ShippingCost $shippingCost)
    {
        $validator = $this->shippingCostService->DataValidation($request, 'patch', $shippingCost);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
        $this->shippingCostService->Update($request, $shippingCost);
        return redirect()->route('shipping.index')->with('success', 'Shipping cost updated successfully!');
    }

    public function destroy(ShippingCost $shippingCost)
    {
        $this->shippingCostService->Delete($shippingCost);
        return redirect()->route('shipping.index')->with('success', 'Shipping cost deleted successfully!');
    }

    public function apiIndex(): JsonResponse
    {
        $costs = ShippingCost::with('Port.country')->get();
        return ShippingCostResource::collection($costs)->response();
    }
}