<?php

namespace App\Http\Controllers;

use App\Classes\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * CLIENT: Request a new quote
     */
    public function store(Request $request)
    {
        try {
            // Service handles validation and DB-based price calculation
            $order = $this->orderService->createOrderSnapshot($request->all(), Auth::id());
            return response()->json($order, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * CLIENT: Get list of own orders
     */
    public function getUserOrders(Request $request)
    {
        // Automatically uses Order::mine() through the service
        return $this->orderService->getPaginatedOrders($request);
    }

    /**
     * CLIENT: Confirm a quote (move to proforma)
     */
    public function confirmOrder($id)
    {
        try {
            return $this->orderService->confirmOrder((int)$id);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    /**
     * CLIENT: Cancel a quote/proforma
     */
    public function cancelOrder($id)
    {
        return $this->orderService->cancelOrder((int)$id);
    }

    /**
     * CLIENT: Download PDF Invoice/Quote
     */
    public function downloadInvoice($id)
    {
        try {
            $fileInfo = $this->orderService->getDownloadPath($id);
            return response()->download($fileInfo['path'], $fileInfo['name']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 404);
        }
    }

    /**
     * ADMIN: View all orders (Inertia Management)
     */
    public function index(Request $request)
    {
        // Admins pass through Order::mine() and see everything
        return $this->orderService->getPaginatedOrders($request);
    }

    /**
     * ADMIN: Show single order details
     */
    public function show($id)
    {
        return $this->orderService->getOrderById((int)$id);
    }

    /**
     * ADMIN: Update status manually
     */
    public function updateStatusManagement(Order $order, Request $request)
    {
        try {
            $this->orderService->updateStatusManagement($order, $request->status);
            return response()->json(['message' => 'Status updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }
}