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
            $table->string('order_number');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('customer_country');
            $table->string('customer_adress');
            $table->unsignedBigInteger('shipping_id')->index();
            $table->foreign('shipping_id')->references('id')->on('shipping-adress')->onDelete('cascade');
            $table->string('total_amount');
            $table->enum('order_status', ['pending', 'completed', 'canceled'])->default('pending');
            $table->enum('delivery_status', ['not_shipped', 'shipped', 'delivered'])->default('not_shipped');
            $table->enum('payment_method', ['credit_card', 'paypal', 'bank_transfer', 'cash'])->default('credit_card');
            $table->string('order_date');
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
