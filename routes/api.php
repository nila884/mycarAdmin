<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\CarController;

 Route::get('api/brands', [BrandController::class, 'apiIndex'])->name('api.brands');
 Route::get('api/fuels', [FuelController::class, 'apiIndex'])->name('api.fuels');
 Route::get('api/categories', [CategoryController::class, 'apiIndex'])->name('api.categories');
 Route::get('api/models', [ModelController::class, 'apiIndex'])->name('api.models');
 Route::get('api/versions', [VersionController::class, 'apiIndex'])->name('api.versions');

Route::get('api/cars-search', [CarController::class, 'carsSearch'])->name('api.cars.search');
// Route::get('api/cars-filter', [CarController::class, 'carsFilter'])->name('api.cars.filter');

Route::get('api/cars/home', [CarController::class, 'carsHome'])->name('api.cars.home');

Route::get('api/cars/detail/{id}', [CarController::class, 'carDetail'])->name('api.cars.detail');

