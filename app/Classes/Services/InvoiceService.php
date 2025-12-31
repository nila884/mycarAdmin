<?php
namespace App\Classes\Services;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class InvoiceService
{


    /**
     * Get All Invoices for Admin
     */
    public function getAllInvoices($perPage = 15)
    {
        return Invoice::with(['order.car', 'order.user'])->latest()->paginate($perPage);
    }

    /**
     * Create a new invoice automatically from an Order Snapshot
     * Called by OrderService
     */
    public function createInvoiceForOrder(Order $order,$pdf_path)
    {

        if (!$order->total_amount || $order->total_amount <= 0) {
            throw new \Exception("Cannot create an invoice for an order with no total amount.");
        }

        $invoiceData = [
            'order_id'       => $order->id,
            'invoice_number' => 'INV-' . strtoupper(Str::random(10)), // Reference stays upper
            'amount_due'     => $order->total_amount,
            'payment_status'         => Str::lower('unpaid'), 
            'pdf_path' => $pdf_path,
        ];


        return Invoice::create($invoiceData);
    }

    /**
     * Update Status with Validation (Admin logic)
     */
    public function updateStatus(int $id, array $data)
    {
        $validator = Validator::make($data, [
            'status' => 'required|in:unpaid,paid,cancelled',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $invoice = Invoice::findOrFail($id);
        
        // Ensure status is stored in lowercase
        $invoice->update([
            'status' => Str::lower($data['status'])
        ]);

        // If paid, sync back to the order status
        if (Str::lower($data['status']) === 'paid') {
            $invoice->order->update(['status' => 'paid']);
        }

        return $invoice;
    }

    public function getInvoiceDetails(int $id)
    {
        return Invoice::with(['order.car', 'order.user'])->findOrFail($id);
    }


    /**
     * Delete Invoice
     */
    public function deleteInvoice(int $id)
    {
        $invoice = Invoice::findOrFail($id);
        return $invoice->delete();
    }

    
}