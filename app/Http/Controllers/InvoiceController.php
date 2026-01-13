<?php
namespace App\Http\Controllers;

use App\Http\Resources\InvoiceResource;
use App\Services\InvoiceService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * ADMIN: List all invoices (Paginated)
     * GET /api/invoices
     */
    public function index()
    {
        $invoices = $this->invoiceService->getAllInvoices();
        return InvoiceResource::collection($invoices);
    }

    /**
     * CLIENT/ADMIN: Show specific invoice details
     * GET /api/invoices/{id}
     */
    public function show($id)
    {
        // getInvoiceDetails in the service eager-loads relations
        $invoice = $this->invoiceService->getInvoiceDetails($id);
        return new InvoiceResource($invoice);
    }

    /**
     * ADMIN: Update payment status or PDF path
     * PUT /api/invoices/{id}
     */
    public function update(Request $request, $id)
    {
        // Service handles validation and lowercase status sync
        $invoice = $this->invoiceService->updateStatus($id, $request->all());
        return new InvoiceResource($invoice);
    }

    /**
     * ADMIN: Delete an invoice
     * DELETE /api/invoices/{id}
     */
    public function destroy($id)
    {
        $this->invoiceService->deleteInvoice($id);
        return response()->json([
            'message' => 'invoice deleted successfully'
        ], 200);
    }
}