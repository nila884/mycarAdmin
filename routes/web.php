<?php

use App\Http\Controllers\admin\UserController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CarController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
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

    Route::get('shipping', function () {
        return Inertia::render('shipping/shipping');
    })->name('shipping');


    Route::get('car/list', [CarController::class, 'index'])->name('car.index');
    Route::post('car/store', [CarController::class, 'store'])->name('car.store');
    Route::get('car/create', [CarController::class, 'create'])->name('car.create');
    Route::get('car/{car}/edit', [CarController::class, 'edit'])->name('car.edit');
    Route::post('car/{car}/update', [CarController::class, 'update'])->name('car.update');
    Route::delete('car/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    Route::get('car/{car}/show', [CarController::class, 'show'])->name('car.show');

    Route::resource('/module', ModuleController::class);
    Route::resource('/permission', PermissionController::class);
    Route::resource('/role', RoleController::class);
    Route::resource('/user', UserController::class);
});

require __DIR__ . '/api.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
