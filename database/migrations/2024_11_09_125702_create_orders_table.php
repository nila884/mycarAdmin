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
                    $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Fixed Type
    
                    $table->foreignId('delivery_tariff_id')->constrained('delivery_tariffs'); // Fixed Table Name
                    
                    $table->decimal('total_amount', 12, 2); // Fixed from String to Decimal
                    $table->enum('order_status', ['pending', 'completed', 'canceled'])->default('pending');
                    $table->enum('delivery_status', ['not_shipped', 'shipped', 'delivered'])->default('not_shipped');
                    $table->enum('payment_method', ['bank_transfer', 'credit_card'])->default('bank_transfer');
                    $table->timestamps(); 
                });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
