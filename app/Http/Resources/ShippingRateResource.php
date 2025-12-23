<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingRateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
        'id' => $this->id,
        'transport_mode'=>$this->transport_mode,
        'from_country'=>CountryResource::make( $this->whenLoaded('originCountry')),
        'from_port'=> PortResource::make( $this->whenLoaded('originPort')) ,
        'to_country'=>CountryResource::make( $this->whenLoaded('destinationCountry')),
        'to_port'=>PortResource::make( $this->whenLoaded('destinationPort')),
        'price_roro'=>$this->price_roro,
        'price_container'=>$this->price_container,
        'is_current'=>$this->is_current,
        'updated_at' => $this->updated_at?->format('Y-m-d'),
        'created_at' => $this->created_at?->format('Y-m-d'),
        ];
    }
}