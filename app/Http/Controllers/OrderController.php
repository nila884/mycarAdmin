<?php
namespace App\Http\Controllers;

use App\Classes\Services\OrderService;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
    {
      
 
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $order = $this->orderService->createOrderSnapshot($request->all(), Auth::id());
        return new OrderResource($order);
    }
    
    
    // public function index()
    // {
    //     $orders = $this->orderService->getAllOrders();
    //     return OrderResource::collection($orders);
    // }

    public function show($id)
    {
        $order = $this->orderService->getOrderById($id);
        return new OrderResource($order);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        
        $order = $this->orderService->updateStatus($id, $request->status);
        return new OrderResource($order);
    }


    public function destroy($id)
    {
        $this->orderService->deleteOrder($id);
        return response()->json(['message' => 'Order deleted successfully']);
    }

    public function getUserOrders()
    {
        return $this->orderService->getUserOrders();
    }
    public function cancelOrder($id){
        require $this->orderService->cancelOrder($id);
    }

    public function confirmOrder($id)
{
    try {
        $order = $this->orderService->confirmOrder($id);
        return response()->json($order);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}
public function downloadInvoice($id){
try {
        // 1. Get the path and filename from the Service
        $fileData = $this->orderService->getDownloadPath($id);

        // 2. Force clear buffers to prevent binary corruption
        if (ob_get_level()) ob_end_clean();

        // 3. Return the actual file stream (NOT JSON)
        return response()->file($fileData['path'], [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $fileData['name'] . '"',
            'Access-Control-Expose-Headers' => 'Content-Disposition'
        ]);

    } catch (\Exception $e) {
        // Only use JSON if an error actually happens
        return response()->json(['error' => $e->getMessage()], 404);
    }
}

public function index(Request $request)
    {
        return Inertia::render('order/list', [
            'orders'  => $this->orderService->getPaginatedOrders($request),
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    public function updateStatusManagement(Request $request, Order $order)
    {
        $validated = $request->validate(['status' => 'required|string']);
        $this->orderService->updateStatusManagement($order, $validated['status']);
        return back()->with('success', 'Status updated.');
    }
    
}