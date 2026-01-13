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
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Mockery;
// 1. Import the Attribute class
use PHPUnit\Framework\Attributes\Test;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $orderService;
    protected $invoiceServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->invoiceServiceMock = Mockery::mock(InvoiceService::class);
        $this->orderService = new OrderService($this->invoiceServiceMock);
        Storage::fake('public');
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    // 2. Use the #[Test] attribute instead of /** @test */
    #[Test]
    public function it_calculates_total_price_correctly_when_creating_snapshot()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $car = Car::first();
        $car->update(['weight' => 2000]); 
        
        $car->prices()->where('is_current', true)->update([
            'price' => 10000, 
            'discount' => 1000
        ]);

        $shippingRate = ShippingRate::factory()->create(['price_roro' => 1000]);
        $tariff = DeliveryTariff::factory()->create([
            'tarif_per_tone' => 100, 
            'driver_fee' => 50,
            'agency_service_fee' => 50,
            'clearing_fee' => 500
        ]);

        $data = [
            'car_id' => $car->id,
            'car_price' => 9000,
            'total_price' => 10800,
            'shipping_rate_id' => $shippingRate->id,
            'delivery_tariff_id' => $tariff->id,
            'shipping_method' => 'roro',
            'car_weight' => 2000
        ];

        $this->invoiceServiceMock->shouldReceive('createInvoiceForOrder')->once();

        $order = $this->orderService->createOrderSnapshot($data, $user->id);

        $this->assertEquals(10800, $order->total_amount);
    }

    #[Test]
    public function it_updates_status_to_proforma_on_confirmation()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'quote'
        ]);

        $this->orderService->confirmOrder($order->id);

        $this->assertEquals('proforma', $order->refresh()->status);
    }


    #[Test]
public function it_successfully_records_financial_margins_when_creating_a_car()
{
    $seller = User::factory()->create();
    $seller->assignRole('seller');

    $carData = [
        'category_id' => 1,
        'fuel_type_id' => 1,
        'version_id' => 1,
        'mileage' => 50000,
        'chassis_number' => 'ABC-123',
        'weight' => 1500,
        'cost_price' => 10000.00,        // <--- The key field
        'min_profit_margin' => 500.00,   // <--- The key field
        'seating_capacity' => 5,
        'doors' => 4,
        'transmission' => 'automatic',
        'steering' => 'right',
        'origin_country_id' => 1,
    ];

    $this->actingAs($seller);
    $response = $this->postJson('/api/cars', $carData);

    $response->assertStatus(201);
    
    $this->assertDatabaseHas('cars', [
        'chassis_number' => 'ABC-123',
        'cost_price' => 10000.00,
        'min_profit_margin' => 500.00
    ]);
}

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}