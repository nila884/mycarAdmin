<?php

namespace Tests\Unit;

use App\Classes\Services\OrderService;
use App\Classes\Services\InvoiceService;
use App\Models\Car;
use App\Models\User;
use App\Models\ShippingRate;
use App\Models\DeliveryTariff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;

class OrderFinanceTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;
    protected $invoiceServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Mock the InvoiceService to prevent actual PDF generation during testing
        $this->invoiceServiceMock = Mockery::mock(InvoiceService::class);
        $this->orderService = new OrderService($this->invoiceServiceMock);
        
        // Seed to provide necessary data (Ports, Countries, etc.)
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    #[Test]
    public function it_calculates_land_transit_and_benefit_rigorously()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // 1. Setup Car Financials (The "Guard" parameters)
        $car = Car::first();
        $car->update([
            'weight' => 1850,              // 1.85 Tons
            'cost_price' => 3000.00,       // Our purchase price
            'min_profit_margin' => 500.00  // Minimum profit we must make
        ]);

        // 2. Setup current selling price (The "FOB" parameters)
        // We delete seeded prices to ensure we use this specific one
        $car->prices()->delete();
        $car->prices()->create([
            'price' => 5000.00,
            'discount' => 200.00,
            'discount_type' => 'amount',
            'is_current' => true
        ]);

        // 3. Setup Logistics
        $tariff = DeliveryTariff::factory()->create([
            'tarif_per_tone' => 150.00,
            'driver_fee' => 10.00,
            'agency_service_fee' => 7.65,
            'clearing_fee' => 500.00,
            'is_current' => true
        ]);

        $shippingRate = ShippingRate::first();

        // 4. Act with Valid Data
        // Calculated FOB = 5000 - 200 = 4800. 
        // 4800 > (3000 cost + 500 margin), so it should PASS the guard.
        $data = [
            'car_id' => $car->id,
            'car_price' => 5000.00,
            'total_price' => 10000.00, 
            'shipping_rate_id' => $shippingRate->id,
            'delivery_tariff_id' => $tariff->id,
            'shipping_method' => 'roro',
            'car_weight' => 1850 
        ];

        $this->invoiceServiceMock->shouldReceive('createInvoiceForOrder')->once();
        
        $order = $this->orderService->createOrderSnapshot($data, $user->id);

        // 5. Rigorous Financial Assertions
        // Land Transit: (1.85 * 150) + 10 + 7.65 = 295.15
        $this->assertEquals(295.15, (float)$order->land_transit, "Land transit math failed.");
        
        // Benefit: 4800 (FOB) - 3000 (Cost) = 1800
        $this->assertEquals(1800.00, (float)$order->benefit, "Profit calculation failed.");
        
        // Total Sum Check
        $calculatedTotal = $order->fob_price + $order->sea_freight + $order->land_transit + $order->clearing_fee;
        $this->assertEquals($calculatedTotal, (float)$order->total_amount, "Order total is inconsistent.");
    }

    #[Test]
    public function it_blocks_order_when_profit_is_below_minimum_margin()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $car = Car::first();
        $car->update([
            'cost_price' => 4000.00,
            'min_profit_margin' => 1500.00 // Total min price required = 5500
        ]);

        $car->prices()->delete();
        $car->prices()->create([
            'price' => 5000.00, // Price is too low (5000 < 5500)
            'discount' => 0,
            'is_current' => true
        ]);

        $data = [
            'car_id' => $car->id,
            'car_price' => 5000,
            'total_price' => 8000,
            'shipping_rate_id' => ShippingRate::first()->id,
            'delivery_tariff_id' => DeliveryTariff::first()->id,
            'shipping_method' => 'roro',
            'car_weight' => 2000
        ];

        // This should trigger your custom Exception in OrderService
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Transaction Denied: Selling price is below the required minimum profit margin.");

        $this->orderService->createOrderSnapshot($data, $user->id);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}