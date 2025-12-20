<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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


        Route::get('user/list', [UserController::class, 'index'])->name('user.index');

    Route::get('car/list', [CarController::class, 'index'])->name('car.index');
    Route::post('car/store', [CarController::class, 'store'])->name('car.store');
    Route::get('car/create', [CarController::class, 'create'])->name('car.create');
    Route::get('car/{car}/edit', [CarController::class, 'edit'])->name('car.edit');
    Route::post('car/{car}/update', [CarController::class, 'update'])->name('car.update');
    Route::delete('car/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    Route::get('car/{car}/show', [CarController::class, 'show'])->name('car.show');

    Route::get('management', function () {
        return Inertia::render('management/management');

    })->name('management');
    Route::get('management/module/list', [ModuleController::class, 'index'])->name('module.index');
    Route::post('management/module/store', [ModuleController::class, 'store'])->name('module.store');
    Route::delete('management/module/{module}', [ModuleController::class, 'destroy'])->name('module.destroy');
    Route::patch('management/module/{module}', [ModuleController::class, 'update'])->name('module.update');

    Route::get('management/permission/list', [PermissionController::class, 'index'])->name('permission.index');
    Route::post('management/permission/store', [PermissionController::class, 'store'])->name('permission.store');
    Route::delete('management/permission/{permission}', [PermissionController::class, 'destroy'])->name('permission.destroy');
    Route::patch('management/permission/{permission}', [PermissionController::class, 'update'])->name('permission.update');

    Route::get('management/role/list', [RoleController::class, 'index'])->name('role.index');
    Route::post('management/role/store', [RoleController::class, 'store'])->name('role.store');
    Route::delete('management/role/{role}', [RoleController::class, 'destroy'])->name('role.destroy');
    Route::patch('management/role/{role}', [RoleController::class, 'update'])->name('role.update');

    // Route::resource('/module', ModuleController::class);
    // Route::resource('/permission', PermissionController::class);
    // Route::resource('/role', RoleController::class);
    // Route::resource('/user', UserController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
