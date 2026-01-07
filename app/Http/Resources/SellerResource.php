<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SellerResource extends JsonResource
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
            'name' => $this->seller_name,
            'phone' => $this->phone,
            'address' => $this->address,
            'country' => $this->country,
            'description' => $this->description,
            'avatar' => $this->avatar,
            // 'user' => UserSnapshotResource::make($this->whenLoaded('user')),
            'created_at' => $this->created_at->format('Y-m-d'),
        ];

    }
}
