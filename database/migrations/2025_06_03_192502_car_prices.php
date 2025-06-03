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
    Schema::create('car_prices', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('car_id')->index();
    $table->foreign('car_id')->references('id')->on('cars')->onDelete('cascade');
    $table->decimal('price', 10, 2);
    $table->decimal('discount', 10, 2)->nullable();
    $table->enum('discount_type', ['amount', 'percent'])->nullable();
    $table->boolean('is_current')->default(true);
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('car_prices');
    }
};
