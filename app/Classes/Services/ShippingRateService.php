<?php

namespace App\Classes\Services;

use App\Http\Resources\ShippingRateResource;
use App\Models\Port;
use App\Models\ShippingRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Validator as ValidatorReturn; // Essential for atomicity and integrity

class ShippingRateService
{
    public function Index()
    {
        return ShippingRate::with('originCountry','originPort','destinationCountry','destinationPort')->get();
    }

    public function DataValidation(Request $request, string $method, ?ShippingRate $Rate = null): ?ValidatorReturn
    {
        $rules = [
            'port_id' => ['required', 'exists:ports,id'],
            'price_roro' => ['numeric', 'min:0'],
            'price_container' => ['numeric', 'min:0'],
            'is_current' => ['boolean'], // is_current field
        ];

        return Validator::make($request->all(), $rules);
    }

/**
     * Reusable validation for Create and Update
     */
    public function validateRequest(Request $request)
    {
        return $request->validate([
            'transport_mode'  => 'required|in:sea,land',
            'from_country_id' => 'required|exists:countries,id',
            'from_port_id'    => 'nullable|exists:ports,id',
            'to_country_id'   => 'required|exists:countries,id', // From migration
            'to_port_id'     => 'nullable|exists:ports,id',
            'price_roro'      => 'nullable|numeric|min:0',
            'price_container' => 'nullable|numeric|min:0',
            'is_current'      => 'boolean',
        ]);
    }

    public function Create(Request $request): ShippingRate
    {
        $data = $this->validateRequest($request);

        return DB::transaction(function () use ($data) {
            $this->deactivateOthers($data);
            return ShippingRate::create($data);
        });
    }

    public function Update(Request $request, ShippingRate $rate): ShippingRate
    {
        $data = $this->validateRequest($request);

        return DB::transaction(function () use ($data, $rate) {
            if ($data['is_current'] ?? false) {
                $this->deactivateOthers($data, $rate->id);
            }
            $rate->update($data);
            return $rate;
        });
    }

    protected function deactivateOthers(array $data, $excludeId = null)
    {
        if ($data['is_current'] ?? false) {
            ShippingRate::where('from_country_id', $data['from_country_id'])
                ->where('to_country_id', $data['to_country_id'])
                ->where('to_port_id', $data['to_port_id'])
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->update(['is_current' => false]);
        }
    }

    
    public function Delete(ShippingRate $Rate): bool
    {
        return $Rate->delete();
    }

    public function GetAllPorts()
    {
        return Port::orderBy('name', 'asc')->with('country')->get();
    }
}
