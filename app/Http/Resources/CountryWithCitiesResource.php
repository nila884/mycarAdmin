<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use Illuminate\Support\Facades\Storage; // Ensure Storage facade is imported

class CountryWithCitiesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
         return [
            'id' => $this->id,
            'country_name' => $this->country_name,
            'code' => $this->code,
            'prefix' => $this->prefix,
            'currency' => $this->currency,
            'import_regulation_information' => $this->import_regulation_information,
            'flags_url' => $this->flags ? Storage::url('country/' . $this->flags) : null, 
            'gateway_ports' => PortResource::collection($this->whenLoaded('gatewayPorts')),
            'cities' => CityResource::collection($this->whenLoaded('cities')),
           
        ];
    }
}