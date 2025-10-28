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
            'price' => number_format($this->price, 2), // Format price with two decimals
            'is_current' => (bool)$this->is_current,
            'port_id' => $this->port_id,
            // Eager load the Port and its Country via Port relation
            'port' => new PortResource($this->whenLoaded('Port'))->resolve(), 
         
        ];
    }
}