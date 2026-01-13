<?php
namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ReleaseExpiredQuotes extends Command
{
    // The name of the command you would run manually
    protected $signature = 'quotes:release';
    protected $description = 'Expire old quotations and release cars back to the market';

    public function handle()
    {
        // 1. Find quotes that have expired but are still marked as 'quote' or 'pending'
        $expiredOrders = Order::whereIn('status', ['quote', 'pending'])
            ->where('expires_at', '<', now())
            ->with('car')
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info('No expired quotes found.');
            return;
        }

        foreach ($expiredOrders as $order) {
            DB::transaction(function () use ($order) {
                // 2. Mark order as expired
                $order->update(['status' => 'expired']);

                // 3. Put the car back on the market
                if ($order->car) {
                    $order->car->update(['status' => 'available']);
                }
            });

            $this->info("Expired Order #{$order->order_number} and released Car ID: {$order->car_id}");
        }

        $this->info('Clean up complete.');
    }
}