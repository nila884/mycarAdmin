<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeliveryTariffResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request): array
    {
    
        return [
            'id' => $this->id,
            
            // Raw Attributes
            'service_type' => $this->service_type,
            'delivery_method' => $this->delivery_method,
            'adress_name' => $this->adress_name,
            'tarif_per_tone' => $this->tarif_per_tone,
            'driver_fee' => $this->driver_fee,
            'clearing_fee' => $this->clearing_fee,
            'agency_service_fee' => $this->agency_service_fee,
            'weight_range' => $this->weight_range,

            // Raw Foreign Keys
            'from_country_id' => $this->from_country_id,
            'from_port_id' => $this->from_port_id,
            'from_city_id' => $this->from_city_id,
            'country_id' => $this->country_id,
            'to_city_id' => $this->to_city_id,
            'delivery_driver_agency_id' => $this->delivery_driver_agency_id,

            // Full Relationships
            'country' => $this->whenLoaded('country'),
            'origin_country' => $this->whenLoaded('originCountry'),
            'origin_port' => $this->whenLoaded('originPort'),
            'from_city' => $this->whenLoaded('fromCity'),
            'to_city' => $this->whenLoaded('toCity'),
            'delivery_driver_agency' => $this->whenLoaded('deliveryDriverAgency'),
        ];
    }
}