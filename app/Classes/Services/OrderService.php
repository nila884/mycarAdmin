<?php
namespace App\Classes\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Car;
use App\Models\ShippingRate;
use App\Models\DeliveryTariff;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class OrderService
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

  /**
 * Business Logic: Create a Quotation Snapshot
 * Handles both Land Delivery and Port Pickup automatically.
 */
public function createOrderSnapshot(array $data, int $userId)
{
    $existingOrder = Order::where('user_id', $userId)
        ->where('car_id', $data['car_id'])
        ->whereIn('status', ['quote', 'pending'])
        ->first();

    if ($existingOrder) {
        throw new \Exception("You already have an active quotation for this vehicle. Please check your account.");
    }
    $validator = Validator::make($data, [
        'car_id'             => 'required|exists:cars,id',
        'shipping_rate_id'   => 'required|exists:shipping_rates,id',
        'delivery_tariff_id' => 'nullable|exists:delivery_tariffs,id', // Nullable for Port Pickup
        'shipping_method'    => 'required|in:roro,container',
    ]);

    if ($validator->fails()) {
        throw new ValidationException($validator);
    }

    return DB::transaction(function () use ($data, $userId) {
        // 1. Fetch Car and Prices directly from DB

        $car = Car::with(['prices' => fn($q) => $q->where('is_current', true)])->findOrFail($data['car_id']);
        
        if ($car->status === 'sold') {
            throw new \Exception("This vehicle is no longer available for purchase.");
        }

        $currentPrice = $car->prices->first();
        if (!$currentPrice) {
            throw new \Exception("Active price not found for this vehicle.");
        }

        $rawPrice = $currentPrice->price;
        $discountValue = $currentPrice->discount ?? 0;
        
        // Calculate FOB Price (Discount handling)
        $fobPrice = ($currentPrice->discount_type === 'percent') 
            ? $rawPrice - ($rawPrice * ($discountValue / 100))
            : $rawPrice - $discountValue;

        // 2. Profit Margin Guard
        $costPrice = $car->cost_price ?? 0;
        $benefit = $fobPrice - $costPrice;


        // 3. Logistics Calculation
        $seaRate = ShippingRate::findOrFail($data['shipping_rate_id']);
        $seaFreight = (Str::lower($data['shipping_method']) === 'roro') 
            ? $seaRate->price_roro 
            : $seaRate->price_container;  

        // Default values for "Port Pickup" (Logic based on your request)
        $landTransit = 0;
        $clearingFee = 0;
        $isPortPickup = true; 
        $finalCity = 'Dar es Salaam (Port Pickup)';

        // 4. Conditional Delivery Logic: If tariff is provided, calculate land costs
        if (!empty($data['delivery_tariff_id'])) {
            $tariff = DeliveryTariff::findOrFail($data['delivery_tariff_id']);
            $weightInTons = $car->weight / 1000;
            
            $landTransit = ($tariff->tarif_per_tone * $weightInTons) + $tariff->driver_fee + $tariff->agency_service_fee;
            $clearingFee = $tariff->clearing_fee;
            $finalCity = Str::lower($tariff->toCity->name ?? 'tba');
            $isPortPickup = false; // System detects this is NOT a pickup
        }

        $totalAmount = $fobPrice + $seaFreight + $landTransit + $clearingFee;

        // 5. Generate Order Number
        $nextId = Order::max('id') + 1;
        $orderNumber = 'QT-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);

        // 6. Create Order Entry
        $order = Order::create([
            'order_number'           => $orderNumber,
            'user_id'                => $userId,
            'benefit'                => $benefit,
            'car_id'                 => $car->id,
            'fob_price'              => $fobPrice,
            'sea_freight'            => $seaFreight,
            'land_transit'           => $landTransit,
            'clearing_fee'           => $clearingFee,
            'total_amount'           => $totalAmount,
            'origin_port'            => Str::lower($seaRate->originPort->name),
            'destination_port'       => Str::lower($seaRate->toPort->name ?? 'dar es salaam'),
            'final_destination_city' => $finalCity,
            'shipping_method'        => Str::lower($data['shipping_method']),
            'is_port_pickup'         => $isPortPickup, // Saved to DB for PDF/Admin use
            'status'                 => 'quote',
            'expires_at'             => now()->addHours(48),
        ]);

        

        // 7. PDF Generation & Storage
        $pdfData = [
            'order'        => $order,
            'car'          => $car,
            'user'         => Auth::user(),
            'issue_date'   => now()->format('d-M-Y'),
            'valid_until'  => $order->expires_at->format('d-M-Y'),
            'bank_details' => config('settings.bank_details'),
            'note'         => config('settings.quotes.footer_note'),
            'company'      => config('settings.company_info'),
        ];
        
        $pdf = Pdf::loadView('pdf.quotation', $pdfData);
        $fileName = 'quotes/' . $order->order_number . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        // 8. Create associated Invoice
        $this->invoiceService->createInvoiceForOrder($order, $fileName);
        
        return $order;
    });
}

    /**
     * Get Paginated Orders 
     * Uses Order::mine() to ensure Clients only see theirs, Admins see all.
     */
    public function getPaginatedOrders(Request $request)
    {
        return OrderResource::collection(
            Order::mine() // <--- SECURITY: Using your new scope
                ->with(['car.version.carModel.brand', 'invoice', 'user'])
                ->when($request->search, function ($query, $search) {
                    $query->where('order_number', 'like', "%{$search}%");
                })
                ->latest()
                ->paginate($request->input('per_page', 10))
        );
    }

    /**
     * Get Single Order
     */
    public function getOrderById(int $id)
    {
        // mine() scope will throw 404 if user tries to access someone else's ID
        return Order::mine()->with(['car.price', 'user', 'invoice'])->findOrFail($id);
    }

    /**
 * Securely get the physical path for the PDF download.
 * Uses scopeMine to ensure users only download their own documents.
 */
public function getDownloadPath($id)
{

    $order = Order::mine()
        ->with('invoice','user')
        ->findOrFail($id);

    if (!$order->invoice || !$order->invoice->pdf_path) {
        throw new \Exception("No invoice record found for this order.");
    }

    $path = $order->invoice->pdf_path; 
    $fullPath = storage_path('app/public/' . $path);
    
    if (!file_exists($fullPath)) {
        throw new \Exception("The PDF file was not found on the server. Please regenerate the quote.");
    }
    return [
        'path' => $fullPath,
        'name' =>$order->order_number.'.pdf'
    ];
}

    /**
     * Client: Cancel Order
     */
    public function cancelOrder($id)
    {
        $order = Order::mine()->findOrFail($id);

        if (!in_array($order->status, ['quote', 'proforma'])) {
            return response()->json(['error' => 'Confirmed or Paid orders require admin intervention to cancel.'], 400);
        }

        $order->update(['status' => 'cancelled']); 
        if ($order->invoice) {
            $order->invoice->update(['payment_status' => 'cancelled']); 
        }

        return response()->json(['message' => 'Order cancelled successfully.']);
    }

public function confirmOrder(int $id)
{
    // Use the mine() scope to ensure security
    $order = Order::mine()->findOrFail($id);

    if ($order->status !== 'quote') {
        throw new \Exception("Only quotations can be confirmed.");
    }

    return DB::transaction(function () use ($order) {
        // 1. Update Status
        $order->update([
            'status' => 'proforma',
            // Optional: Reset expiration to 48 hours from NOW 
            // to give them time to take the proforma to the bank.
            'expires_at' => now()->addHours(48), 
        ]);

        // 2. Create or Update Invoice record
        $invoice = $order->invoice()->firstOrCreate(
            ['order_id' => $order->id],
            [
                'invoice_number' => 'INV-' . date('Ymd') . '-' . $order->id,
                'amount_due' => $order->total_amount,
                'payment_status' => 'unpaid'
            ]
        );

        // 3. Generate the Proforma PDF
        $pdfData = [
            'order' => $order->load('car', 'user'),
            'invoice' => $invoice,
            'type' => 'PROFORMA INVOICE',
            'issue_date'   => now()->format('d-M-Y'),
            'valid_until'  => $order->expires_at->format('d-M-Y'),
            'bank_details' => config('settings.bank_details'),
            'note'         => config('settings.quotes.footer_note'),
            'company'      => config('settings.company_info'),
        ];

        $pdf = Pdf::loadView('pdf.proforma', $pdfData);
        $fileName = 'invoices/proforma_' . $order->order_number . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        // 4. Record the file path in the invoice table
        $invoice->update(['pdf_path' => $fileName]);

        return new OrderResource($order->load('invoice'));
    });
}

    public function confirmPayment($orderId)
{
            if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Only admins can change order statuses manually.');
        }
    return DB::transaction(function () use ($orderId) {
        $order = Order::with('car')->lockForUpdate()->findOrFail($orderId);

        // 1. Check if someone else bought it while this user was thinking
        if ($order->car->status === 'sold') {
            // Refund logic would go here
            throw new \Exception("Sorry, this vehicle was sold to another customer just before your payment was processed.");
        }

        // 2. Mark as Sold
        $order->car->update(['status' => 'sold']);
        $order->update(['status' => 'paid']);

        return $order;
    });
}

    /**
     * Admin: Change status manually
     */
    public function updateStatusManagement(Order $order, string $status): void
    {
        // Check if current user is admin via Spatie
        if (!Auth::user()->hasRole('admin')) {
            abort(403, 'Only admins can change order statuses manually.');
        }

        $order->update(['status' => Str::lower($status)]);
    }
}