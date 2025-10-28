<?php
namespace App\Classes\Services;

use App\Models\ShippingCost;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorReturn;

use App\Models\Port;
use Illuminate\Support\Facades\DB; // Essential for atomicity and integrity

class ShippingCostService
{
    public function Index()
    {
        // Eager load port and its country for efficient display
        return ShippingCost::with('Port.country')->orderBy('port_id', 'asc')->get();
    }

    public function DataValidation(Request $request, string $method, ShippingCost|null $cost = null): ValidatorReturn|null
    {
        $rules = [
            "port_id" => ["required", "exists:ports,id"],
            "price_roro" => [ "numeric", "min:0"],
            "price_container" => [ "numeric", "min:0"],
            "is_current" => ["boolean"], // is_current field
        ];

        return Validator::make($request->all(), $rules);
    }

    public function Create(Request $request): ShippingCost
    {
        $data = $request->only('port_id', 'price_roro','price_container', 'is_current');
        
        // Ensure only one active price exists per port using a transaction
        return DB::transaction(function () use ($data) {
            if ($data['is_current'] ?? false) {
                // Deactivate any existing current price for this port
                ShippingCost::where('port_id', $data['port_id'])
                            ->where('is_current', true)
                            ->update(['is_current' => false]);
            }
            return ShippingCost::create($data);
        });
    }

    public function Update(Request $request, ShippingCost $cost): ShippingCost
    {
        $data = $request->only('port_id', 'price_roro','price_container', 'is_current');
        
        return DB::transaction(function () use ($data, $cost) {
            $isBeingActivated = ($data['is_current'] ?? false) && $data['is_current'] !== $cost->is_current;
            $portIdIsChanging = $data['port_id'] != $cost->port_id;
            
            if ($isBeingActivated || $portIdIsChanging) {
                if ($data['is_current'] ?? false) {
                    ShippingCost::where('port_id', $data['port_id'])
                                ->where('is_current', true)
                                ->where('id', '!=', $cost->id) // Exclude the current record being updated
                                ->update(['is_current' => false]);
                }
            }
            
            $cost->update($data);
            return $cost;
        });
    }

    public function Delete(ShippingCost $cost): bool
    {
        return $cost->delete();
    }
    public function GetAllPorts()
    {
        return  Port::orderBy('name', 'asc')->with('country')->get();
    }
}