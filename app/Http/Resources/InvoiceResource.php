<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_number,
            'order_ref' => $this->order->order_number ?? 'n/a',
            'amount' => (float) $this->amount_due,
            'status' => $this->status, // Already lowercase from service
            'pdf_url' => $this->pdf_path ? Storage::url($this->pdf_path) : null,
            
            // Nested car info for the "Show" page in React
            'car_details' => [
                'chassis' => $this->order->car->chassis_number ?? 'unknown',
                'model' => $this->order->car->model_code ?? 'unknown',
            ],

            'customer' => [
                'name' => $this->order->user->name ?? 'guest',
                'email' => $this->order->user->email ?? 'n/a',
            ],

            'issued_at' => $this->created_at->format('y-m-d'),
            'updated_at' => $this->updated_at->format('y-m-d'),
        ];
    }
}