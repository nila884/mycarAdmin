<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use Illuminate\Support\Facades\Storage; // Ensure Storage facade is imported

class CountryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
         return [
       'id' => $this->id,
            'name' => $this->country_name,
            'code' => $this->code,
            'prefix' => $this->prefix,
            'currency' => $this->currency,
            // Construct the public URL for the flag file
            'flags_url' => $this->flags ? Storage::url('country/' . $this->flags) : null, 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            // Include user count if the relation is eager loaded (e.g., Country::withCount('users'))
            'users_count' => $this->whenCounted('users'),
        ];
    }
}