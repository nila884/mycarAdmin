<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResource extends JsonResource
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
            'location' => $this->location,
            'image_main' =>  ImageResource::make($this->whenLoaded('imageMain')),
            'price' => CarPriceResource::make($this->whenLoaded('currentPrice')),
            'spect' => [
                'engine_code' => $this->engine_code,
                'engine_size' => $this->engine_size,
                'model_code' => $this->model_code,
                'wheel_driver' => $this->wheel_driver,
                'm_3' => $this->m_3,
                'weight' => $this->weight,
                'chassis_number' => $this->chassis_number,
                'registration_year' => $this->registration_year,
                'manufacture_year' => $this->manufacture_year,
                'color' => $this->color,
                'mileage' => $this->mileage,
                'transmission' => $this->transmission,
                'steering' => $this->streering,
                'seating_capacity' => $this->steating_capacity,
                'doors' => $this->doors,
                'dimensions' => $this->dimensions,
            ],
            'category' => CategoryResource::make($this->whenLoaded('category')),
            'fuel_type' => FuelTypeResource::make($this->whenLoaded('fuelType')),
            'version' => VersionResource::make($this->whenLoaded('version')),
            'seller' => SellerResource::make($this->whenLoaded('seller')),
            'features' => FeatureResource::collection($this->whenLoaded('features')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'origin_country'=>CountryResource::make($this->whenLoaded('originCountry')),
        ];
    }
}
