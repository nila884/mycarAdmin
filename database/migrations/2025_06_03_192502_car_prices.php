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

    $table->index(['car_id', 'is_current']);
    $table->index(['is_current', 'discount']);
    $table->index('price');
        $table->decimal('final_price', 10, 2)
        ->storedAs("
            CASE
                WHEN discount_type = 'percent'
                    THEN price - (price * discount / 100)
                WHEN discount_type = 'amount'
                    THEN price - discount
                ELSE price
            END
        ");

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
