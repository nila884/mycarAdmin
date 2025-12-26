<?php
namespace App\Classes\Services;

use App\Models\DeliveryTariff;
use App\Http\Resources\DeliveryTariffResource;
use Illuminate\Http\Request;

class DeliveryTariffService
{
    public function Index()
    {
       
        return 
       DeliveryTariff::with([
            'country', 
            'originCountry', 
            'originPort', 
            'fromCity', 
            'toCity', 
            'deliveryDriverAgency'
        ])->get();
       
    }

    public function validateRequest(Request $request)
    {
        return $request->validate([
            'from_country_id'           => 'required|exists:countries,id',
            'from_port_id'              => 'nullable|exists:ports,id',
            'from_city_id'              => 'nullable|exists:cities,id', // Precision Origin
            'country_id'                => 'required|exists:countries,id',
            'to_city_id'                => 'required|exists:cities,id',   // Precision Destination
            'service_type'              => 'required|in:self_pickup,individual_driver,agency',
            'delivery_method'           => 'required|in:drive_away,car_carrier,container',
            'delivery_driver_agency_id' => 'required_if:service_type,agency|nullable|exists:delivery_driver_agencies,id',
            'tarif_per_tone'            => 'required|numeric|min:0',
            'driver_fee'                => 'nullable|numeric|min:0',
            'clearing_fee'              => 'nullable|numeric|min:0',
            'agency_service_fee'        => 'nullable|numeric|min:0',
            'weight_range'              => 'nullable|string',
            'adress_name'               => 'nullable|string', // Legacy support
        ]);
    }

    public function Create(Request $request): DeliveryTariff
    {
        $data = $this->validateRequest($request);
        return DeliveryTariff::create($data);
    }

    public function Update(Request $request, DeliveryTariff $tariff): DeliveryTariff
    {
        $data = $this->validateRequest($request);
        $tariff->update($data);
        return $tariff;
    }

    public function Delete(DeliveryTariff $tariff): bool
    {
        return $tariff->delete();
    }
}