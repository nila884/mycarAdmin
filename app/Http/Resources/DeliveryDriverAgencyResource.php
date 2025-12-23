<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryDriverAgencyResource extends JsonResource
{
public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'name' => $this->name,
        'business_registration_number' => $this->business_registration_number,
        'fleet_size' => $this->fleet_size,
            'person' => $this->contact_person,
            'phone' => $this->phone,
            'email' => $this->email,
    ];
}
}