<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;

Route::get('brands', [BrandController::class, 'apiIndex'])->name('api.brands');
Route::get('fuels', [FuelController::class, 'apiIndex'])->name('api.fuels');
Route::get('categories', [CategoryController::class, 'apiIndex'])->name('api.categories');
Route::get('amodels', [ModelController::class, 'apiIndex'])->name('api.models');
Route::get('versions', [VersionController::class, 'apiIndex'])->name('api.versions');
Route::get('features', [FeatureController::class, 'apiIndex'])->name('api.features');

    Route::get('/role', [RoleController::class,'index']);
    Route::post('/permission', [PermissionController::class,'store']);
    Route::patch('/role/{role}', [RoleController::class,'update']);
    Route::delete('/module/{module}', [ModuleController::class,'destroy']);

Route::get('api/cars-search', [CarController::class, 'carsSearch'])->name('api.cars.search');
Route::get('/api/cars/recomended', [CarController::class, 'carRecomended'])->name('api.cars.recomanded');

Route::get('api/cars/home', [CarController::class, 'carsHome'])->name('api.cars.home');

Route::get('api/cars/detail/{id}', [CarController::class, 'carDetail'])->name('api.cars.detail');

Route::get('api/m/cars/home', [CarController::class, 'carsHomeMobile'])->name('api.cars.home.mobile');

Route::get('api/shipping-details', [CountryController::class, 'shippingDetails'])->name('api.cars.shipping.details');
