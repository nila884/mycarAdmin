<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\VersionController;
use Illuminate\Support\Facades\Route;

Route::get('brands', [BrandController::class, 'apiIndex'])->name('api.brands');
Route::get('fuels', [FuelController::class, 'apiIndex'])->name('api.fuels');
Route::get('categories', [CategoryController::class, 'apiIndex'])->name('api.categories');
Route::get('models', [ModelController::class, 'apiIndex'])->name('api.models');
Route::get('versions', [VersionController::class, 'apiIndex'])->name('api.versions');
Route::get('features', [FeatureController::class, 'apiIndex'])->name('api.features');

Route::get('cars-search', [CarController::class, 'carsSearch'])->name('api.cars.search');
Route::get('cars/recomended', [CarController::class, 'carRecomended'])->name('api.cars.recomanded');

Route::get('cars/home', [CarController::class, 'carsHome'])->name('api.cars.home');

Route::get('cars/detail/{id}', [CarController::class, 'carDetail'])->name('api.cars.detail');

Route::get('m/cars/home', [CarController::class, 'carsHomeMobile'])->name('api.cars.home.mobile');

Route::get('shipping-details', [CountryController::class, 'shippingDetails'])->name('api.cars.shipping.details');
