<?php

namespace Tests\Unit;

use App\Classes\Services\OrderService;
use App\Classes\Services\InvoiceService;
use App\Models\Car;
use App\Models\User;
use App\Models\CarPrice;
use App\Models\ShippingRate;
use App\Models\DeliveryTariff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;

class OrderPromotionTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;
    protected $invoiceServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->invoiceServiceMock = Mockery::mock(InvoiceService::class);
        $this->orderService = new OrderService($this->invoiceServiceMock);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    #[Test]
    public function it_calculates_fob_price_with_fixed_amount_discount()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $car = Car::first();
        // Clear existing prices and set a fixed discount
        $car->prices()->delete();
        $car->prices()->create([
            'price' => 10000.00,
            'discount' => 1500.00,
            'discount_type' => 'amount',
            'is_current' => true
        ]);

        $data = $this->getValidOrderData($car);

        $this->invoiceServiceMock->shouldReceive('createInvoiceForOrder')->once();
        
        $order = $this->orderService->createOrderSnapshot($data, $user->id);

        // Expected: 10000 - 1500 = 8500
        $this->assertEquals(8500.00, (float)$order->fob_price);
    }

    #[Test]
    public function it_calculates_fob_price_with_percentage_discount()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $car = Car::first();
        $car->prices()->delete();
        $car->prices()->create([
            'price' => 10000.00,
            'discount' => 10.00, // 10%
            'discount_type' => 'percent',
            'is_current' => true
        ]);

        $data = $this->getValidOrderData($car);

        $this->invoiceServiceMock->shouldReceive('createInvoiceForOrder')->once();
        
        $order = $this->orderService->createOrderSnapshot($data, $user->id);

        /** * NOTE: If your current Service logic is only doing ($price - $discount), 
         * this test will FAIL and show you that you need to add a check for 'discount_type'.
         * Expected: 10000 - (10000 * 0.10) = 9000
         */
        $this->assertEquals(9000.00, (float)$order->fob_price, "Percentage discount logic failed.");
    }

    /**
     * Helper to keep the test clean
     */
    private function getValidOrderData($car)
    {
        return [
            'car_id' => $car->id,
            'car_price' => 10000,
            'total_price' => 15000,
            'shipping_rate_id' => ShippingRate::first()->id,
            'delivery_tariff_id' => DeliveryTariff::first()->id,
            'shipping_method' => 'roro',
            'car_weight' => $car->weight
        ];
    }
    

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}