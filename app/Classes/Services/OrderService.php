<?php
namespace App\Classes\Services;

use App\Models\{Order, OrderItem, Invoice, Car, ShippingRate, DeliveryTariff};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderService
{
    public function createOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            // 1. Setup the Base Order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'user_id' => auth()->id(),
                'delivery_tariff_id' => $data['delivery_tariff_id'], // The city/port choice
                'total_amount' => 0, // Will update after calculating items
            ]);

            $grandTotal = 0;

            foreach ($data['car_ids'] as $carId) {
                $car = Car::findOrFail($carId);
                
                // Get Car Price (Snapshot)
                $unitPrice = $car->prices()->where('is_current', true)->first()->price ?? 0;

                // 2. Calculate Dynamic Shipping (RORO vs Container)
                $shippingFees = $this->calculateTotalShipping(
                    $car, 
                    $data['shipping_method'], // 'price_roro' or 'price_container'
                    $data['delivery_tariff_id']
                );

                // 3. Create Item Snapshot (Locks the price forever)
                OrderItem::create([
                    'order_id' => $order->id,
                    'car_id' => $car->id,
                    'unit_price' => $unitPrice,
                    'shipping_fees' => $shippingFees,
                ]);

                $grandTotal += ($unitPrice + $shippingFees);
            }

            // 4. Update Order and Generate Invoice
            $order->update(['total_amount' => $grandTotal]);

            Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-' . time(),
                'total_amount' => $grandTotal,
            ]);

            return $order;
        });
    }

    private function calculateTotalShipping(Car $car, $method, $deliveryTariffId)
    {
        // Get the Inland Tariff (Port to City)
        $tariff = DeliveryTariff::findOrFail($deliveryTariffId);
        
        // Find the Ocean Route (Origin Country -> Destination Country)
        $route = ShippingRate::where('from_country_id', $car->origin_country_id)
            ->where('to_country_id', $tariff->country_id)
            ->where('is_current', true)
            ->first();

        // Ocean Cost (RORO or Container)
        $oceanCost = ($method === 'container') ? $route->price_container : $route->price_roro;

        // Inland Cost (Weight * Rate)
        // Convert car weight (grams/kg) to tons if necessary
        $weightInTons = $car->weight / 1000; 
        $inlandCost = $weightInTons * (float)$tariff->tarif_per_tone;

        return $oceanCost + $inlandCost;
    }
}