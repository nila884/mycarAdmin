<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FuelController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ModelController;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');


    Route::post('car/settings/category', [CategoryController::class, 'store'])->name('carcategory.store');
    Route::patch('/car/settings/category/{category}', [CategoryController::class, 'update'])->name('carcategory.update');
    Route::delete('/car/settings/category/{category}', [CategoryController::class, 'destroy'])->name('carcategory.destroy');
    Route::get('car/settings/category', [CategoryController::class, 'index'])->name('carcategory.index');

    Route::post('car/settings/fuel', [FuelController::class, 'store'])->name('carfuel.store');
    Route::patch('/car/settings/fuel/{fuelType}', [FuelController::class, 'update'])->name('carfuel.update');
    Route::delete('/car/settings/fuel/{fuelType}', [FuelController::class, 'destroy'])->name('carfuel.destroy');
    Route::get('car/settings/fuel', [FuelController::class, 'index'])->name('carfuel.index');

    Route::get('car/settings/brand', [BrandController::class, 'index'])->name('carbrand.index');
    Route::post('car/settings/brand', [BrandController::class, 'store'])->name('carbrand.store');
    Route::patch('car/settings/brand/{brand}', [BrandController::class, 'update'])->name('carbrand.update');
    Route::delete('car/settings/brand/{brand}', [BrandController::class, 'destroy'])->name('carbrand.destroy');

    Route::get('car/settings/model', [ModelController::class, 'index'])->name('carmodel.index');
    Route::post('car/settings/model', [ModelController::class, 'store'])->name('carmodel.store');
    Route::patch('car/settings/model/{carModel}', [ModelController::class, 'update'])->name('carmodel.update');
    Route::delete('car/settings/model/{carModel}', [ModelController::class, 'destroy'])->name('carmodel.destroy');
});
