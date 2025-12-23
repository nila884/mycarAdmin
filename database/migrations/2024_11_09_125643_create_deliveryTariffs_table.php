<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
Schema::create('delivery_tariffs', function (Blueprint $table) {
        $table->id();
// 1. ROUTE PRECISION
        $table->foreignId('from_country_id')->nullable()->constrained('countries');
        $table->foreignId('from_port_id')->nullable()->constrained('ports');
        $table->foreignId('from_city_id')->nullable()->constrained('cities'); 
        
        $table->foreignId('country_id')->constrained('countries'); // Destination Country
        $table->foreignId('to_city_id')->nullable()->constrained('cities'); // Precision Destination City
        $table->string('adress_name')->nullable(); // Legacy support

        // 2. SERVICE & METHOD LOGIC
        // Choice: Self-pickup, Individual Driver, or Agency
        $table->enum('service_type', ['self_pickup', 'individual_driver', 'agency'])->default('individual_driver');
        // Choice: Driving, Car Carrier, or Container
        $table->enum('delivery_method', ['drive_away', 'car_carrier', 'container'])->default('drive_away');
        
        // Link to the explicit agency table
        $table->foreignId('delivery_driver_agency_id')->nullable()->constrained('delivery_driver_agencies');

        // 3. PRICING
        $table->decimal('tarif_per_tone', 12, 2); 
        $table->decimal('driver_fee', 12, 2)->default(0); 
        $table->decimal('clearing_fee', 12, 2)->default(0);
        $table->decimal('agency_service_fee', 12, 2)->default(0); 
        
        $table->string('weight_range')->nullable();
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
