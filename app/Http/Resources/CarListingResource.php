<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarListingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'car_selling_status' => $this->car_selling_status,
            'location' => 'originCountry',
            'image_main' => new ImageResource($this->whenLoaded('imageMain')),
            'price' => new CarPriceResource($this->whenLoaded('currentPrice')),
            'origin_country'=>new CountryResource($this->whenLoaded('originCountry') ),
            'spect' => [

                'manufacture_year' => $this->manufacture_year,
                'mileage' => $this->mileage,

            ],
            'version' => new VersionResource($this->whenLoaded('version')),

        ];
    }
}
