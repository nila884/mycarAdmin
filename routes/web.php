<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\VersionController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('car/settings', function () {
        return Inertia::render('car/settings/settings');
    })->name('carsettings');
    
    Route::get('car/settings/brand', [BrandController::class, 'index'])->name('carbrand');
     Route::get('car/settings/fuel', [FuelController::class, 'index'])->name('carfuel');
    Route::get('car/settings/model', [ModelController::class, 'index'])->name('carmodel');
    Route::get('car/settings/feature', [FeatureController::class, 'index'])->name('carfeature');
    Route::get('car/settings/category', [CategoryController::class, 'index'])->name('carcategory');
    Route::get('car/settings/seller',[SellerController::class, 'index'])->name('carseller');
    Route::get('car/settings/version', [VersionController::class, 'index'])->name('carversion');
    Route::get('car/list',[CarController::class, 'index'])->name('carlist');
    Route::get('car/create', [CarController::class, 'create'])->name('carcreate');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
