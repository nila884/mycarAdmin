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
     * SECURITY FIX: Prices are calculated purely from DB, ignoring frontend price inputs.
     */
    public function createOrderSnapshot(array $data, int $userId)
    {
        $validator = Validator::make($data, [
            'car_id' => 'required|exists:cars,id',
            'shipping_rate_id' => 'required|exists:shipping_rates,id',
            'delivery_tariff_id' => 'required|exists:delivery_tariffs,id',
            'shipping_method' => 'required|in:roro,container',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return DB::transaction(function () use ($data, $userId) {
            // 1. Fetch Car and Prices directly from DB (Security: Do not trust $data['car_price'])
            $car = Car::with(['prices' => fn($q) => $q->where('is_current', true)])->findOrFail($data['car_id']);
            
            $currentPrice = $car->prices->first();
            if (!$currentPrice) {
                throw new \Exception("Active price not found for this vehicle.");
            }

            $rawPrice = $currentPrice->price;
            $discountValue = $currentPrice->discount ?? 0;
            
            // Calculate FOB Price
            $fobPrice = ($currentPrice->discount_type === 'percent') 
                ? $rawPrice - ($rawPrice * ($discountValue / 100))
                : $rawPrice - $discountValue;

            // 2. Profit Margin Guard
            $costPrice = $car->cost_price ?? 0;
            $benefit = $fobPrice - $costPrice;

            if ($fobPrice < ($costPrice + ($car->min_profit_margin ?? 0))) {
                throw new \Exception("Transaction Denied: Pricing error or margin too low.");
            }

            // 3. Logistics Calculation (Security: Do not trust frontend calculations)
            $seaRate = ShippingRate::findOrFail($data['shipping_rate_id']);
            $tariff = DeliveryTariff::findOrFail($data['delivery_tariff_id']);
            
            $seaFreight = (Str::lower($data['shipping_method']) === 'roro') ? $seaRate->price_roro : $seaRate->price_container;  
            $weightInTons = $car->weight / 1000;
            $landTransit = ($tariff->tarif_per_tone * $weightInTons) + $tariff->driver_fee + $tariff->agency_service_fee;
            
            $totalAmount = $fobPrice + $seaFreight + $landTransit + $tariff->clearing_fee;
            $nextId = Order::max('id') + 1;
            $orderNumber = 'QT-' . date('Y') . '-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
            // 4. Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $userId,
                'benefit' => $benefit,
                'car_id' => $car->id,
                'fob_price' => $fobPrice,
                'sea_freight' => $seaFreight,
                'land_transit' => $landTransit,
                'clearing_fee' => $tariff->clearing_fee,
                'total_amount' => $totalAmount,
                'origin_port' => Str::lower($seaRate->originPort->name),
                'destination_port' => Str::lower($seaRate->toPort->name ?? 'tba'),
                'final_destination_city' => Str::lower($tariff->toCity->name ?? 'tba'),
                'shipping_method' => Str::lower($data['shipping_method']),
                'status' => 'quote',
                'expires_at' => now()->addDays(config('settings.quotes.validity_days', 30)),
            ]);

            // PDF Generation
            $pdfData = [
                'order' => $order,
                'car' => $car,
                'user' => Auth::user(),
                'issue_date' => now()->format('d-M-Y'),
                'valid_until' => $order->expires_at->format('d-M-Y'),
                'bank_details' => config('settings.bank_details'),
                'valid_until' => $order->expires_at->format('d-M-Y'),
                'note' => config('settings.quotes.footer_note'),
                'company' => config('settings.company_info'),
            ];
            
            $pdf = Pdf::loadView('pdf.quotation', $pdfData);
            $fileName = 'quotes/' . $order->order_number . '.pdf';
            Storage::disk('public')->put($fileName, $pdf->output());

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
                ->get()
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
        ->with('invoice')
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
        'name' => $order->order_number . '.pdf'
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

    /**
     * Client: Confirm a Quote (Proforma)
     */
    public function confirmOrder(int $id)
    {
        $order = Order::mine()->findOrFail($id);

        if ($order->status !== 'quote') {
            throw new \Exception("Only quotations can be confirmed.");
        }

        $order->update(['status' => 'proforma']);

        $order->invoice()->firstOrCreate([
            'order_id' => $order->id
        ], [
            'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
            'amount_due' => $order->total_amount,
            'payment_status' => 'unpaid'
        ]);

        return new OrderResource($order->load('invoice'));
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