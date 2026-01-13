<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('auth/login');
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
Route::get('management', function () {
        return Inertia::render('management/management');

    })->name('management');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
