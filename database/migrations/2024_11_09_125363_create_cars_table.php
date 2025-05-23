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
            $table->unsignedBigInteger('car_model_id')->index();
            $table->unsignedBigInteger('category_id')->index();
            // $table->unsignedBigInteger('power_id')->index();
            $table->unsignedBigInteger('fuel_type_id')->index();
            $table->unsignedBigInteger('version_id')->index();
            $table->unsignedBigInteger('seller_id')->index();
            $table->string('mileage');
            $table->string('chassis_number');
            $table->string('registration_year')->nullable();
            $table->string('manufacture_year')->nullable();
            $table->string('color');
            $table->string('weight');
            $table->string('price');
            $table->string('status')->nullable();
            $table->string('transmission');
            $table->enum('streeting', ['right', 'left']);
            $table->string('steating_capacity');
            $table->string('engine_code')->nullable();
            $table->string('engine_size')->nullable();
            $table->string('model_code')->nullable();
            $table->string('wheel_driver')->nullable();
            $table->string('m_3')->nullable();
            $table->string('doors');
            $table->text('dimensions')->nullable();
            $table->string('location')->nullable();
            $table->foreign('car_model_id')->references('id')->on('car_models')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            // $table->foreign('power_id')->references('id')->on('engine_powers')->onDelete('cascade');
            $table->foreign('fuel_type_id')->references('id')->on('fuel_types')->onDelete('cascade');
            $table->foreign('seller_id')->references('id')->on('sellers')->onDelete('cascade');
            $table->foreign('version_id')->references('id')->on('versions')->onDelete('cascade');
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
