<?php

namespace App\Http\Controllers;

use App\Classes\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
    {
        dd("request price quote");
        $validated = $request->validate([
            'car_ids' => 'required|array',
            'car_ids.*' => 'exists:cars,id',
            'delivery_tariff_id' => 'required|exists:delivery_tariffs,id',
            'shipping_method' => 'required|in:price_roro,price_container',
        ]);

        try {
            $order = $this->orderService->createOrder($validated);
            return response()->json([
                'success' => true, 
                'order_number' => $order->order_number,
                'message' => 'Order and Invoice generated successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 400);
        }
    }
}