<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\FeatureController;
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
    
    Route::get('car/settings/seller',[SellerController::class, 'index'])->name('carseller');
    Route::get('car/list',[CarController::class, 'index'])->name('carlist');
    Route::get('car/create', [CarController::class, 'create'])->name('carcreate');
    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
