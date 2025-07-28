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
           $table->unsignedInteger('mileage');
            $table->string('chassis_number');
            $table->year('registration_year')->nullable();
            $table->year('manufacture_year')->nullable();
            $table->string('color');

            $table->string('image')->nullable();
            $table->unsignedInteger('weight');
            $table->boolean('status')->nullable();
            $table->enum('transmission', ['automatic', 'manual']);
            $table->enum('streering', ['right', 'left']);
            $table->enum('publication_status',['published','pending','archived']);
            $table->enum('car_sells_status',['sold','selling','reserved']);
            $table->unsignedInteger('steating_capacity');
            $table->string('engine_code')->nullable();
            $table->decimal('engine_size', 3, 1)->nullable();
            $table->string('model_code')->nullable();
            $table->string('wheel_driver')->nullable();
            $table->decimal('m_3',4,2)->nullable();
            $table->unsignedTinyInteger('doors');
            $table->json('dimensions')->nullable();
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
