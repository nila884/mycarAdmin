<?php

namespace Database\Factories;

use App\Models\Feature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Feature>
 */
class FeatureFactory extends Factory
{
    protected $model = Feature::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $features = [
            ['feature_name' => 'Sunroof', 'description' => 'Allows fresh air and sunlight into the cabin.', 'icon' => 'link'],
            ['feature_name' => 'Headlamp (HID, LED)', 'description' => 'High-intensity discharge or LED lights for better visibility.', 'icon' => 'link'],
            ['feature_name' => 'Parking sensor (front, rear)', 'description' => 'Detects obstacles while parking.', 'icon' => 'link'],
            ['feature_name' => 'Smart Key', 'description' => 'Keyless entry and push-start ignition system.', 'icon' => 'link'],
            ['feature_name' => 'Rear camera', 'description' => 'Displays rear view for safer reversing.', 'icon' => 'link'],
            ['feature_name' => 'Navigation', 'description' => 'GPS system for route guidance.', 'icon' => 'link'],
            ['feature_name' => 'Heated seats (front and rear)', 'description' => 'Keeps seats warm in cold weather.', 'icon' => 'link'],
            ['feature_name' => 'Ventilated seats (front, rear)', 'description' => 'Cools seats with built-in ventilation.', 'icon' => 'link'],
            ['feature_name' => 'Automatic air conditioning', 'description' => 'Regulates cabin temperature automatically.', 'icon' => 'link'],
            ['feature_name' => 'Wireless phone charger', 'description' => 'Charges devices without cables.', 'icon' => 'link'],
            ['feature_name' => 'Power electric trunk', 'description' => 'Opens and closes the trunk with a button press.', 'icon' => 'link'],
            ['feature_name' => 'Ghost door closing', 'description' => 'Automatically closes doors softly if not fully shut.', 'icon' => 'link'],
            ['feature_name' => 'Power folding side mirrors', 'description' => 'Mirrors fold automatically when parking or locking.', 'icon' => 'link'],
            ['feature_name' => 'Aluminum wheels', 'description' => 'Lightweight and durable alloy wheels for better performance.', 'icon' => 'link'],
            ['feature_name' => 'Roof rack', 'description' => 'Additional storage space for luggage and gear.', 'icon' => 'link'],
            ['feature_name' => 'Heated steering wheel', 'description' => 'Keeps the steering wheel warm in cold weather.', 'icon' => 'link'],
            ['feature_name' => 'Power adjustable steering wheel', 'description' => 'Easily adjust steering wheel position electronically.', 'icon' => 'link'],
            ['feature_name' => 'Paddle shift', 'description' => 'Manual gear shifting via paddles on the steering wheel.', 'icon' => 'link'],
            ['feature_name' => 'Steering wheel remote control', 'description' => 'Control audio and cruise functions from the wheel.', 'icon' => 'link'],
            ['feature_name' => 'ECM room mirror', 'description' => 'Auto-dimming rearview mirror to reduce glare.', 'icon' => 'link'],
            ['feature_name' => 'Hi-pass', 'description' => 'Electronic toll collection system for convenience.', 'icon' => 'link'],
            ['feature_name' => 'Power door lock', 'description' => 'Centralized locking system for enhanced security.', 'icon' => 'link'],
            ['feature_name' => 'Power steering wheel', 'description' => 'Effortless steering control with power assistance.', 'icon' => 'link'],
            ['feature_name' => 'Power Windows', 'description' => 'Electronic window controls for easy operation.', 'icon' => 'link'],
            ['feature_name' => 'Airbag (Driver & Passenger)', 'description' => 'Provides safety in case of a frontal collision.', 'icon' => 'link'],
            ['feature_name' => 'Airbag (side)', 'description' => 'Protects passengers from side impacts.', 'icon' => 'link'],
            ['feature_name' => 'Airbag (curtain)', 'description' => 'Deploys from the roof to protect against rollovers.', 'icon' => 'link'],
            ['feature_name' => 'Anti-lock brakes (ABS)', 'description' => 'Prevents wheels from locking during hard braking.', 'icon' => 'link'],
            ['feature_name' => 'Anti-slip (TCS)', 'description' => 'Reduces wheel spin on slippery roads.', 'icon' => 'link'],
            ['feature_name' => 'Electronic Stability Control (ESC)', 'description' => 'Enhances vehicle stability during sharp turns.', 'icon' => 'link'],
            ['feature_name' => 'Tire Pressure Sensor (TPMS)', 'description' => 'Monitors tire pressure to prevent underinflation.', 'icon' => 'link'],
            ['feature_name' => 'Lane Departure Warning System (LDWS)', 'description' => 'Alerts driver when unintentionally drifting out of lane.', 'icon' => 'link'],
            ['feature_name' => 'Electronically controlled suspension (ECS)', 'description' => 'Adjusts suspension for optimal ride comfort.', 'icon' => 'link'],
            ['feature_name' => 'Rear side warning system', 'description' => 'Warns of vehicles in blind spots.', 'icon' => 'link'],
            ['feature_name' => '360-degree around view', 'description' => 'Provides a full view around the vehicle for parking.', 'icon' => 'link'],
            ['feature_name' => 'Cruise control (normal, adaptive)', 'description' => 'Maintains a steady speed without throttle input.', 'icon' => 'link'],
            ['feature_name' => 'Head-up display (HUD)', 'description' => 'Projects key driving info onto the windshield.', 'icon' => 'link'],
            ['feature_name' => 'Electronic Parking Brake (EPB)', 'description' => 'Engages the parking brake electronically.', 'icon' => 'link'],
            ['feature_name' => 'Automatic air conditioning', 'description' => 'Regulates cabin temperature automatically.', 'icon' => 'link'],
            ['feature_name' => 'Wireless door lock', 'description' => 'Locks/unlocks doors remotely.', 'icon' => 'link'],
            ['feature_name' => 'Rain sensor', 'description' => 'Automatically activates wipers in rain.', 'icon' => 'link'],
            ['feature_name' => 'Auto light', 'description' => 'Turns headlights on/off automatically.', 'icon' => 'link'],
            ['feature_name' => 'Curtains/Blinds (Rear Seat, Rear)', 'description' => 'Provides privacy and sun protection.', 'icon' => 'link'],
            ['feature_name' => 'Front seat AV monitor', 'description' => 'Entertainment screen for front passengers.', 'icon' => 'link'],
            ['feature_name' => 'Rear seat AV monitor', 'description' => 'Entertainment screens for rear passengers.', 'icon' => 'link'],
            ['feature_name' => 'CD player', 'description' => 'Plays CDs for in-car entertainment.', 'icon' => 'link'],
            ['feature_name' => 'USB port', 'description' => 'Provides power and connectivity for devices.', 'icon' => 'link'],
            ['feature_name' => 'AUX terminal', 'description' => 'Connects external audio devices.', 'icon' => 'link'],
            ['feature_name' => 'Leather seats', 'description' => 'Premium leather upholstery for luxury feel.', 'icon' => 'link'],
            ['feature_name' => 'Massage Seat', 'description' => 'Built-in massage function for driver/passenger.', 'icon' => 'link'],
            ['feature_name' => 'Blind-spot monitoring', 'description' => 'Alerts driver of vehicles in blind spots.', 'icon' => 'link'],
            ['feature_name' => 'Wireless phone charger', 'description' => 'Charges devices without cables.', 'icon' => 'link'],
            ['feature_name' => 'Remote start', 'description' => 'Starts the car remotely.', 'icon' => 'link'],
            ['feature_name' => 'Adaptive headlights', 'description' => 'Adjusts headlights for better visibility.', 'icon' => 'link'],
            ['feature_name' => 'Premium audio system', 'description' => 'High-quality sound system for immersive audio.', 'icon' => 'link'],
            ['feature_name' => 'Apple CarPlay/Android Auto', 'description' => 'Integrates smartphone apps with the infotainment system.', 'icon' => 'link'],
        ];
        $featuresIcon = collect([
            '/storage/feature_icons/1765592828_seat-heat.png',
            '/storage/feature_icons/1765593321_power-door-lock.jpg',
        ]);

        return [

            'feature_name' => $features[array_rand($features)]['feature_name'],
            'description' => $features[array_rand($features)]['description'],
            'icon' => function (array $attributes) use ($featuresIcon) {
                return $featuresIcon->random();
            },
        ];
    }
}
