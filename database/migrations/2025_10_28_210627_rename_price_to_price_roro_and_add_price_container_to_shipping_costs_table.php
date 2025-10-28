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
        Schema::table('shipping_costs', function (Blueprint $table) {
   
            $table->decimal('price', 10, 2)->nullable()->change();
            $table->renameColumn('price', 'price_roro');
            $table->decimal('price_container', 10, 2)->nullable()->after('price_roro'); 
      
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_costs', function (Blueprint $table) {
            $table->dropColumn('price_container');
            $table->renameColumn('price_roro', 'price');
        });
    }
};
