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
        Schema::create('shipping_costs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('port_id')->index();
            $table->foreign('port_id')->references('id')->on('ports')->onDelete('cascade');
            $table->decimal('price', 10, 2);
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipping_costs');
    }
};
