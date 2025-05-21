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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('model_id')->index();
            $table->unsignedBigInteger('category_id')->index();
            $table->unsignedBigInteger('power_id')->index();
            $table->unsignedBigInteger('fuel-type_id')->index();
            $table->unsignedBigInteger('version_id')->index();
            $table->unsignedBigInteger('seller_id')->index();
            $table->string('mileage');
            $table->string('color');
            $table->string('weight');
            $table->string('price');
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
