<?php
namespace App\Http\Controllers;

use App\Classes\Services\OrderService;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
    
    
    public function index()
    {
        $orders = $this->orderService->getAllOrders();
        return OrderResource::collection($orders);
    }

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
        $order = $this->orderService->downloadInvoice($id);
        return response()->json($order);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
    }
}

    
}