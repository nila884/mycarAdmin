<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VersionResourceManagement extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'version_name' => $this->version_name,
            'version_year' => $this->version_year, // Fixed: was version_name
            'car_model_id' => $this->car_model_id,
            // Only transform the model if it's actually loaded in the query
            'car_model' => ModelResourceManagement::make($this->whenLoaded('carModel')),
            'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? $this->updated_at->format('Y-m-d') : null,
        ];
    }
}