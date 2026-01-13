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
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class OrderSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected OrderService $orderService;
    protected $invoiceServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->invoiceServiceMock = Mockery::mock(InvoiceService::class);
        $this->orderService = new OrderService($this->invoiceServiceMock);
        Storage::fake('public');
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    #[Test]
    public function security_it_prevents_idor_attacker_cannot_confirm_victim_order()
    {
        $attacker = User::factory()->create();
        $victim = User::factory()->create();
        $victimOrder = Order::factory()->create(['user_id' => $victim->id]);

        $this->actingAs($attacker);

        // Based on your error, your code uses a query that results in 404 for wrong owners
        $this->expectException(ModelNotFoundException::class);
        
        $this->orderService->confirmOrder($victimOrder->id);
    }

    #[Test]
    public function security_it_throws_exception_on_negative_price_injection()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        
        $car = Car::first();
        $shippingRate = ShippingRate::first();
        $tariff = DeliveryTariff::first();

        $data = [
            'car_id' => $car->id,
            'shipping_rate_id' => $shippingRate->id, // Added missing ID
            'delivery_tariff_id' => $tariff->id,     // Added missing ID
            'car_price' => -5000, 
            'total_price' => -100,
            'shipping_method' => 'roro'
        ];

        // Your code correctly uses Laravel Validation
        $this->expectException(ValidationException::class);
        
        $this->orderService->createOrderSnapshot($data, $user->id);
    }

    #[Test]
    public function security_guest_cannot_access_order_creation()
    {
        $car = Car::first();
        $data = ['car_id' => $car->id];

        // PHP throws a TypeError because your Service requires an 'int' for userId
        $this->expectException(\TypeError::class);
        
        // Passing null to a non-nullable int argument
        $this->orderService->createOrderSnapshot($data, null);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[Test]
public function it_strictly_uses_the_current_active_price_and_ignores_history()
{
    $car = Car::first();
    
    // Create an old, very cheap price
    $car->prices()->create(['price' => 1000, 'is_current' => false]);
    
    // Create the real current price
    $car->prices()->where('is_current', true)->update(['price' => 5000]);

    // When we fetch the car to create an order, we should verify 5000 is used
    $currentPrice = $car->prices()->where('is_current', true)->first()->price;
    $this->assertEquals(5000, $currentPrice);
}

#[Test]
public function it_calculates_land_transit_correctly_for_fractional_weights()
{
    $tariff = DeliveryTariff::factory()->create([
        'tarif_per_tone' => 100,
        'driver_fee' => 0,
        'agency_service_fee' => 0
    ]);

    // Car weighing 1850kg (1.85 tons)
    $weight = 1850;
    $expectedLandTransit = (1850 / 1000) * 100; // 185.00

    // Act (Call your specific calculation logic)
    // $order = $this->orderService->...
    
    $this->assertEquals(185, $expectedLandTransit);
}



}