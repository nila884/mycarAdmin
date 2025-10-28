<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShippingCostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'price_roro' => number_format($this->price_roro, 2),
            'price_container' => number_format($this->price_container, 2),
            'is_current' => (bool)$this->is_current,
            'port_id' => $this->port_id,
            'port' => new PortResource($this->whenLoaded('Port')), 
         
        ];
    }
}