<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarResourceManagement extends JsonResource
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
            'image_main' => ImageResource::make($this->whenLoaded('imageMain')),
            'price' => CarPriceResourceManagement::make($this->whenLoaded('currentPrice')),
            'interior_color' => $this->whenLoaded('interiorColor'),
            'exterior_color' => $this->whenLoaded('exteriorColor'),
            'spect' => [
                'engine_code' => $this->engine_code,
                'engine_size' => $this->engine_size,
                'model_code' => $this->model_code,
                'wheel_driver' => $this->wheel_driver,
                'm_3' => $this->m_3,
                'weight' => $this->weight,
                'chassis_number' => $this->chassis_number,
                'registration_year' => $this->registration_year,
                'manifactured_year' => $this->manifactured_year,
                'color' => $this->color,
                'status' => $this->status,
                'mileage' => $this->mileage,
                'transmission' => $this->transmission,
                'steering' => $this->steering,
                'seating_capacity' => $this->seating_capacity,
                'doors' => $this->doors,
                'dimensions' => $this->dimensions,
            ],
            'category' => $this->whenLoaded('category'),          
            'car_selling_status' => $this->car_selling_status,
            'publication_status' => $this->publication_status,
            'origin_country'=>CountryResource::make($this->whenLoaded('originCountry')),
            'updated_at' => $this->updated_at?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d'),
            'cost_price' =>$this->cost_price,
            'min_profit_margin' => $this->min_profit_margin,
            'fuel_type' => $this->whenLoaded('fuelType'),
            'version' => $this->whenLoaded('version'),
            'seller' => $this->whenLoaded('seller'),
            'features' => $this->whenLoaded('features'),
            'images' => ImageResource::collection( $this->whenLoaded('images')),
        ];
    }
}
