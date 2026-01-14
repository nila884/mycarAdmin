<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        dd($this);
         return [
            'id' => $this->id,
            'name' => $this->brand_name,
            'logo_url' => $this->logo
                ? asset('storage/' . $this->logo)
                : null,
        ];
    }
}
