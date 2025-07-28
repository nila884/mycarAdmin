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
    

    Route::get('car/list', [CarController::class, 'index'])->name('car.index');
    Route::post('car/store', [CarController::class, 'store'])->name('car.store');
    Route::get('car/create', [CarController::class, 'create'])->name('car.create');
    Route::get('car/{car}/edit', [CarController::class, 'edit'])->name('car.edit');
    Route::post('car/{car}/update', [CarController::class, 'update'])->name('car.update');
    Route::delete('car/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    Route::get('car/{car}/show', [CarController::class, 'show'])->name('car.show');

    

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
