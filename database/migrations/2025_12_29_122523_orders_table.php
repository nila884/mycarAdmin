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

Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('order_number')->unique();
    $table->foreignId('user_id')->constrained();
    $table->foreignId('car_id')->constrained();


    $table->decimal('fob_price', 12, 2); 
    $table->decimal('sea_freight', 12, 2);
    $table->decimal('land_transit', 12, 2);
    $table->decimal('clearing_fee', 12, 2);
    $table->decimal('total_amount', 12, 2);


    $table->string('origin_port');
    $table->string('destination_port');
    $table->string('final_destination_city');

    $table->enum('status', ['quote', 'proforma', 'paid', 'cancelled'])->default('quote');
    $table->timestamp('expires_at'); 
    $table->timestamps();
});


    }

  
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
