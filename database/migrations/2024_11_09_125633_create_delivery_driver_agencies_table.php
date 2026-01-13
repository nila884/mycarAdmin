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
        Schema::create('delivery_driver_agencies', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('business_registration_number')->unique(); 
        $table->string('tax_identification_number')->nullable(); 
        $table->string('contact_person')->nullable();
        $table->string('phone')->nullable();
        $table->string('email')->nullable();
        $table->string('address')->nullable();
        $table->integer('fleet_size')->default(0); 
        $table->boolean('is_active')->default(true);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_driver_agencies');
    }
};
