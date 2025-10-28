<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CountryResource;

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
            // Eager load the Country resource when available
            'country' => new CountryResource($this->whenLoaded('country'))->resolve(), 
            
        ];
    }
}