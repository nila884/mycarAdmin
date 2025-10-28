<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CountryResource;
use App\Http\Resources\ShippingCostResource;

class PortResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'country_id' => $this->country_id,
            'cost' => $this->whenLoaded('currentShippingCost', function () {
                if (!$this->currentShippingCost) {
                    return ShippingCostResource::make(null);
                }
                return ShippingCostResource::make($this->currentShippingCost);
            }),
            
        ];
    }
}