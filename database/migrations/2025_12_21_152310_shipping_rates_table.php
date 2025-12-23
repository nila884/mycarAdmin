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
        Schema::create('shipping_rates', function (Blueprint $table) {
    $table->id();
    $table->enum('transport_mode', ['sea', 'land']);
    // Origin
    $table->foreignId('from_country_id')->constrained('countries');
    $table->foreignId('from_port_id')->nullable()->constrained('ports');
    // Destination (User Selection)
    $table->foreignId('to_country_id')->constrained('countries');
    $table->foreignId('to_port_id')->nullable()->constrained('ports');
    // DYNAMIC PRICES
    $table->decimal('price_roro', 12, 2)->nullable();
    $table->decimal('price_container', 12, 2)->nullable();
    $table->boolean('is_current')->default(true);
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
