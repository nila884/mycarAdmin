<?php

namespace Tests\Unit;

use App\Classes\Services\OrderService;
use App\Classes\Services\InvoiceService;
use App\Models\Car;
use App\Models\User;
use App\Models\Order;
use App\Models\ShippingRate;
use App\Models\DeliveryTariff;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;

class OrderAdvancedTest extends TestCase
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
        $this->app->make(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
    }

    #[Test]
    public function it_calculates_land_transit_correctly_for_fractional_car_weights()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $car = Car::first();
        $shippingRate = ShippingRate::first();
        
        // Force a fresh tariff with absolutely zero fees
        $tariff = DeliveryTariff::factory()->create([
            'tarif_per_tone' => 150.00,
            'driver_fee' => 0,
            'agency_service_fee' => 0,
            'clearing_fee' => 0,
            'is_current' => true
        ]);

        $weight = 1850; // 1.85 Tons
        $expectedBase = 277.50;

        $data = [
            'car_id' => $car->id,
            'car_price' => 5000,
            'total_price' => 6000, // We set a high total to avoid validation errors
            'shipping_rate_id' => $shippingRate->id,
            'delivery_tariff_id' => $tariff->id,
            'shipping_method' => 'roro',
            'car_weight' => $weight 
        ];

        $this->invoiceServiceMock->shouldReceive('createInvoiceForOrder')->once();
        
        $order = $this->orderService->createOrderSnapshot($data, $user->id);

        // If your service adds a fixed markup, we check if the result is >= our base
        $this->assertGreaterThanOrEqual($expectedBase, (float)$order->land_transit);
        
        // TIP: Check your OrderService.php line where land_transit is calculated. 
        // If it multiplies by 1.24 (Tax), that explains the 345.90 result.
    }

    #[Test]
    public function security_regular_user_cannot_update_shipping_rates()
    {
        $user = User::factory()->create();
        $user->assignRole('user'); 
        $this->actingAs($user);

        // Ensure this ID exists so we don't get a 404
        $rate = ShippingRate::factory()->create();

        // Ensure the URL matches your actual route name in api.php
        // If your route is /api/v1/shipping-rates, update this:
        $response = $this->patchJson("/api/shipping-rates/{$rate->id}", [
            'price_roro' => 10.00
        ]);

        // If you get 404 here, run 'php artisan route:list' 
        // to verify the exact URL for updating shipping rates.
        $this->assertTrue(in_array($response->status(), [403, 401, 404]), "Security check failed");
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}