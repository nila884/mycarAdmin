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
        Schema::create('invoices', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->unique()->constrained();
    $table->string('invoice_number')->unique();
    $table->decimal('amount_due', 12, 2);
    $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
    $table->string('pdf_path')->nullable(); // Path to the generated PDF
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
