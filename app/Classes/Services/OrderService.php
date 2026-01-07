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
    protected $invoiceService,$carService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Business Logic: Create a Quotation Snapshot
     */
    public function createOrderSnapshot(array $data, int $userId)
    {
      
        $validator = Validator::make($data, [
            'car_id'=>'required|exists:cars,id',
            'car_price' => 'required',
            'total_price' => 'required',
            'shipping_rate_id' => 'required|exists:shipping_rates,id',
            'delivery_tariff_id' => 'required|exists:delivery_tariffs,id',
            'shipping_method' => 'required|in:roro,container',
            'car_weight'=>'required'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return DB::transaction(function () use ($data, $userId) {
            $car = Car::with(['version.carModel.brand','currentPrice'=> function ($query) {
                            $query->where('is_current', true);}
                            ])->findOrFail($data['car_id']);
            $seaRate = ShippingRate::findOrFail($data['shipping_rate_id']);
            $tariff = DeliveryTariff::findOrFail($data['delivery_tariff_id']);
            // Find where you define $fobPrice and replace with this:
                $currentPrice = $car->prices->first();
                $rawPrice = $currentPrice->price;
                $discountValue = $currentPrice->discount ?? 0;
                if ($currentPrice->discount_type === 'percent') {
                    // Math: Price - (Price * (10 / 100))
                    $fobPrice = $rawPrice - ($rawPrice * ($discountValue / 100));
                } else {
                    // Default: Fixed Amount (Price - 1500)
                    $fobPrice = $rawPrice - $discountValue;
                }

                $costPrice = $car->cost_price ?? 0;

                // This is your Benefit (Gross Profit on the FOB price)
                $benefit = $fobPrice - $costPrice;

                // Rigorous Check: Ensure you aren't selling below cost + min margin
                if ($fobPrice < ($costPrice + $car->min_profit_margin)) {
                    throw new \Exception("Transaction Denied: Selling price is below the required minimum profit margin.");
                }
                
            // $fobPrice = $car->currentPrice->price - ($car->currentPrice->discount ?? 0);
            $seaFreight = ($data['shipping_method'] === 'roro') ? $seaRate->price_roro : $seaRate->price_container;  
            $weightInTons = $car->weight / 1000;
            $landTransit = ($tariff->tarif_per_tone * $weightInTons) + $tariff->driver_fee + $tariff->agency_service_fee;
            $order = Order::create([
                'order_number' => 'QT-' . strtoupper(Str::random(12)), // Reference code stays uppercase
                'user_id' => $userId,
                'benefit' => $benefit,
                'car_id' => $car->id,
                'fob_price' => $fobPrice,
                'sea_freight' => $seaFreight,
                'land_transit' => $landTransit,
                'clearing_fee' => $tariff->clearing_fee,
                'total_amount' => $fobPrice + $seaFreight + $landTransit + $tariff->clearing_fee,
                'origin_port' => Str::lower('YOKOHAMA, JAPAN'),
                'destination_port' => Str::lower($seaRate->toPort->name ?? 'tba'),
                'final_destination_city' => Str::lower($tariff->toCity->name ?? 'tba'),
                'shipping_method' => Str::lower($data['shipping_method']),
                'status' => 'quote',
                'expires_at' => now()->addDays(30),
            ]);
           
            $pdfData = [
            'order' => $order,
            'car' => $car,
            'user' => Auth::user(),
            // Mapping fields to match the reference PDF structure 
            'issue_date' => now()->format('d-M-Y'),
            'valid_until' => $order->expires_at->format('d-M-Y'),
            'bank_details' => [
                'name' => 'SUMITOMO MITSUI BANKING CORPORATION',
                'swift' => 'SMBCJPJT',
                'account' => '988-5000137',
                'name_on_account' => 'BE FORWARD CO.LTD,.'
            ]
        ];
        $pdf = Pdf::loadView('pdf.quotation', $pdfData);
        
        $fileName = 'quotes/' . $order->order_number . '.pdf';
        Storage::disk('public')->put($fileName, $pdf->output());

        // $order->update(['invoice_path' => $fileName]);
        $this->invoiceService->createInvoiceForOrder($order,$fileName);
            return $order;
        });
    }

    /**
     * Get Paginated Orders for Admin
     */
    public function getAllOrders($perPage = 15)
    {
        return Order::with(['car', 'user'])->latest()->paginate($perPage);
    }

    /**
     * Get Single Order Details
     */
    public function getOrderById(int $id)
    {
        return Order::with(['car.price', 'user', 'invoice'])->findOrFail($id);
    }

    /**
     * Update Order Status with Validation
     */
    public function updateStatus(int $id, string $status)
    {
        $order = Order::findOrFail($id);
        
        $validStatuses = ['quote', 'proforma', 'paid', 'cancelled'];
        if (!in_array(Str::lower($status), $validStatuses)) {
            throw new \InvalidArgumentException("Invalid status: $status");
        }

        $order->update(['status' => Str::lower($status)]);
        return $order;
    }

    /**
     * Delete Order
     */
    public function deleteOrder(int $id)
    {
        $order = Order::findOrFail($id);
        return $order->delete();
    }

    public function getUserOrders()
{

    $orders = Order::with([
        'car', 
        'invoice' 
    ])
    ->where('user_id', Auth::user()->id)
    ->latest()
    ->get();
    return OrderResource::collection($orders);
}


public function cancelOrder($id)
{

    $order = Order::where('user_id',Auth::user()->id)->findOrFail($id);
    if (in_array($order->status, ['quote', 'proforma'])) {
        $order->update(['status' => 'cancelled']); 
        if ($order->invoice) {
            $order->invoice->update(['payment_status' => 'unpaid']); 
        }
        return response()->json(['message' => 'Order cancelled successfully.']);
    }
    return response()->json(['error' => 'Paid or shipped orders cannot be cancelled.'], 400);
}

/**
 * Logic to specifically Confirm a Quote
 */
public function confirmOrder(int $id)
{
    $order = Order::with('user')->where('user_id', Auth::user()->id)->findOrFail($id);

    if ($order->status !== 'quote') {
        throw new \Exception("Only quotations can be confirmed.");
    }

    // 1. Update status
    $order->update(['status' => 'proforma']);

    // 2. Create the Invoice record if it doesn't exist
    $order->invoice()->firstOrCreate([
        'order_id' => $order->id
    ], [
        'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
        'amount_due' => $order->total_amount,
        'payment_status' => 'unpaid'
    ]);

    return new OrderResource($order->load('invoice'));
}


public function getDownloadPath($id)
{
    // Find the order for the logged-in user
    $order = Order::with('user')->where('user_id', Auth::user()->id)
                  ->with('invoice')
                  ->findOrFail($id);

    $path = $order->invoice->pdf_path; // e.g., "quotes/QT-123.pdf"
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        throw new \Exception("The PDF file does not exist on the server.");
    }

    return [
        'path' => $fullPath,
        'name' => $order->order_number . '.pdf'
    ];
}

public function getPaginatedOrders(Request $request)
    {
        $orders = Order::query()
            // Eager load everything used in your OrderResource
            ->with(['car.version.carModel.brand', 'car.exteriorColor', 'invoice']) 
            ->when($request->search, function ($query, $search) {
                $query->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('car.version.carModel', fn($q) => $q->where('model_name', 'like', "%{$search}%"));
            })
            ->when($request->status && $request->status !== 'all', function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'))
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return OrderResource::collection($orders);
    }

    public function updateStatusManagement(Order $order, string $status): void
    {
        $order->update(['status' => $status]);
    }

}