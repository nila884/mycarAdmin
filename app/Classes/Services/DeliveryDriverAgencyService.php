<?php
namespace App\Classes\Services;

use App\Http\Resources\DeliveryDriverAgencyResource;
use App\Models\DeliveryDriverAgency;
use Illuminate\Http\Request;

class DeliveryDriverAgencyService
{
    public function validateRequest(Request $request, $agencyId = null)
    {
        return $request->validate([
            'name'                         => 'required|string|max:255',
            'business_registration_number' => 'required|string|unique:delivery_driver_agencies,business_registration_number,' . $agencyId,
            'tax_identification_number'    => 'nullable|string',
            'contact_person'               => 'nullable|string',
            'phone'                        => 'nullable|string',
            'email'                        => 'nullable|email',
            'address'                      => 'nullable|string',
            'fleet_size'                   => 'required|integer|min:0',
        ]);
    }

    public function Index(){
     return DeliveryDriverAgencyResource::collection(DeliveryDriverAgency::all());
    }

    public function Create(Request $request): DeliveryDriverAgency
    {
        $data = $this->validateRequest($request);
        return DeliveryDriverAgency::create($data);
    }

    public function Update(Request $request, DeliveryDriverAgency $agency): DeliveryDriverAgency
    {
        $data = $this->validateRequest($request, $agency->id);
        $agency->update($data);
        return $agency;
    }

    public function Delete(DeliveryDriverAgency $agency): bool
    {
        return $agency->delete();
    }
}