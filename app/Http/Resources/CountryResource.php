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
            'import_regulation_information' => $this->import_regulation_information,
            // Construct the public URL for the flag file
            'flags_url' => $this->flags ? Storage::url('country/' . $this->flags) : null, 
            // Include user count if the relation is eager loaded (e.g., Country::withCount('users'))
            'users_count' => $this->whenCounted('users'),
        ];
    }
}