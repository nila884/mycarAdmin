<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'email' => $this->email,
            'profile' => [
                'country' => $this->client->country ?? null,
                'address' => $this->client->address ?? null,
                'phone'   => $this->client->phone ?? null,
            ],
            // Include token if it was recently generated
            'token' => $this->when($this->token, $this->token),
        ];
    }
}