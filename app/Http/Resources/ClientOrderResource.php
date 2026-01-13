<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientOrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status, 
            'total_amount' => (float) $this->total_amount,
            
            // Flattening the Car Data for the UI
            'car' => [
                'id' => $this->car->id ?? null,
                'name' => ($this->car?->version?->model?->brand?->name ?? 'N/A') . ' ' . ($this->car?->version?->model?->name ?? ''),
                'chassis' => $this->car?->spect?->chassis_number ?? 'N/A',
                'image' => $this->car?->images?->first()?->image_path ?? null, // Thumbnail for dashboard
            ],
      
            'logistics' => [
                'method' => strtoupper($this->shipping_method),
                'destination' => strtoupper($this->destination_port),
                'vessel' => $this->vessel_name ?? 'Pending Vessel Booking',
                'eta' => $this->eta_date ? $this->eta_date->format('d-M-Y') : 'TBA',
            ],
            
   
            'documents' => [
                'invoice_url' => $this->invoice_path ? asset('storage/' . $this->invoice_path) : null,
            ],
            
            'dates' => [
                'created' => $this->created_at->format('d-M-Y'),
                'expires' => $this->expires_at ? $this->expires_at->format('d-M-Y') : null,
            ],
        ];
    }
}