<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;

 Route::get('api/brands', [BrandController::class, 'apiIndex'])->name('api.brands');
 
