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
        Schema::create('cities', function (Blueprint $col) {
    $col->id();
    $col->foreignId('country_id')->constrained()->onDelete('cascade');
    $col->string('name');
    $col->string('state_province')->nullable();
    $col->boolean('is_hub')->default(false); // Useful for identifying main logistics centers
    $col->timestamps();
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
