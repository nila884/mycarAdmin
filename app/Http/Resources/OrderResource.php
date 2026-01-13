<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status, 
            'vehicle' => [
                'id' => $this->car->id ?? null,
                'name' => ($this->car?->version?->carModel?->brand?->name ?? 'N/A') . ' ' . ($this->car?->version?->carModel?->name ?? ''),
                'chassis_number' => $this->car?->chassis_number ?? 'N/A', 
                'transmission' => $this->car?->transmission ?? 'N/A',
                'color' => $this->car?->exteriorColor?->name ?? 'N/A',
                'weight' => $this->car?->weight ? number_format($this->car->weight) . ' KG' : 'N/A',
                'image' => $this->car?->image ?? null, 
            ],

            'pricing' => [
                'fob_price' => (float) $this->fob_price, 
                'sea_freight' => (float) $this->sea_freight, 
                'land_transit' => (float) $this->land_transit, 
                'clearing_fee' => (float) $this->clearing_fee,
                'total_amount' => (float) $this->total_amount,
                'currency' => 'USD',
            ],

            'logistics' => [
                'origin_port' => $this->origin_port,
                'destination_port' => $this->destination_port, 
                'final_destination' => $this->final_destination_city,
            ],

            'documents' => [
                'invoice_url' => $this->invoice?->pdf_path ? asset('storage/' . $this->invoice->pdf_path) : null,
                'is_proforma_available' => in_array($this->status, ['proforma', 'paid']),
            ],

            'dates' => [
                'created_at' => $this->created_at->format('d-M-Y'),
                'expires_at' => $this->expires_at ? $this->expires_at->diffForHumans() : null,
            ],
        ];
    }
}