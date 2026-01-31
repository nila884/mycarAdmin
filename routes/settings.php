<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DeliveryDriverAgencyController;
use App\Http\Controllers\DeliveryTariffController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\PortController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ShippingRateController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VersionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix(env('ADMIN_SECRET_PATH'))->group(function () {
Route::middleware(['auth', 'admin'])->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');


    Route::post('car/settings/category', [CategoryController::class, 'store'])->name('car.settings.category.store');
    Route::patch('/car/settings/category/{category}', [CategoryController::class, 'update'])->name('car.settings.category.update');
    Route::delete('/car/settings/category/{category}', [CategoryController::class, 'destroy'])->name('car.settings.category.destroy');
    Route::get('car/settings/category', [CategoryController::class, 'index'])->name('car.settings.category');

    Route::post('car/settings/fuel', [FuelController::class, 'store'])->name('car.settings.fuel.store');
    Route::patch('/car/settings/fuel/{fuelType}', [FuelController::class, 'update'])->name('car.settings.fuel.update');
    Route::delete('/car/settings/fuel/{fuelType}', [FuelController::class, 'destroy'])->name('car.settings.fuel.destroy');
    Route::get('car/settings/fuel', [FuelController::class, 'index'])->name('car.settings.fuel');

    Route::get('car/settings/brand', [BrandController::class, 'index'])->name('car.settings.brand');
    Route::post('car/settings/brand', [BrandController::class, 'store'])->name('car.settings.brand.store');
    Route::patch('car/settings/brand/{brand}', [BrandController::class, 'update'])->name('car.settings.brand.update');
    Route::delete('car/settings/brand/{brand}', [BrandController::class, 'destroy'])->name('car.settings.brand.destroy');

    Route::get('car/settings/model', [ModelController::class, 'index'])->name('car.settings.model');
    Route::post('car/settings/model', [ModelController::class, 'store'])->name('car.settings.model.store');
    Route::patch('car/settings/model/{carModel}', [ModelController::class, 'update'])->name('car.settings.model.update');
    Route::delete('car/settings/model/{carModel}', [ModelController::class, 'destroy'])->name('car.settings.model.destroy');

    Route::get('car/settings/version', [VersionController::class, 'index'])->name('car.settings.version');
    Route::post('car/settings/version', [VersionController::class, 'store'])->name('car.settings.version.store');
    Route::patch('car/settings/version/{version}', [VersionController::class, 'update'])->name('car.settings.version.update');
    Route::delete('car/settings/version/{version}', [VersionController::class, 'destroy'])->name('car.settings.version.destroy');

    Route::get('car/settings/feature', [FeatureController::class, 'index'])->name('car.settings.feature');
    Route::post('car/settings/feature', [FeatureController::class, 'store'])->name('car.settings.feature.store');
    Route::patch('car/settings/feature/{feature}', [FeatureController::class, 'update'])->name('car.settings.feature.update');
    Route::delete('car/settings/feature/{feature}', [FeatureController::class, 'destroy'])->name('car.settings.feature.destroy');

    Route::get('car/settings/seller', [SellerController::class, 'index'])->name('car.settings.seller');
    Route::post('car/settings/seller', [SellerController::class, 'store'])->name('car.settings.seller.store');
    Route::patch('car/settings/seller/{seller}', [SellerController::class, 'update'])->name('car.settings.seller.update');
    Route::delete('car/settings/seller/{seller}', [SellerController::class, 'destroy'])->name('car.settings.seller.destroy');

     Route::get('car/settings/color', [ColorController::class, 'index'])->name('car.settings.color');
    Route::post('car/settings/color', [ColorController::class, 'store'])->name('car.settings.color.store');
    Route::patch('car/settings/color/{color}', [ColorController::class, 'update'])->name('car.settings.color.update');
    Route::delete('car/settings/color/{color}', [ColorController::class, 'destroy'])->name('car.settings.color.destroy');

    Route::get('shipping/countries', [CountryController::class, 'index'])->name('shipping.country');
    Route::post('shipping/countries', [CountryController::class, 'store'])->name('shipping.country.store');
    Route::patch('shipping/countries/{country}', [CountryController::class, 'update'])->name('shipping.country.update');
    Route::delete('shipping/countries/{country}', [CountryController::class, 'destroy'])->name('shipping.country.destroy');
    Route::post('countries/{country}/gateways', [CountryController::class, 'updateGateways'])->name('shipping.country.gateways.update');


    Route::get('shipping/ports', [PortController::class, 'index'])->name('shipping.port');
    Route::post('shipping/ports', [PortController::class, 'store'])->name('shipping.port.store');
    Route::patch('shipping/ports/{port}', [PortController::class, 'update'])->name('shipping.port.update');
    Route::delete('shipping/ports/{port}', [PortController::class, 'destroy'])->name('shipping.port.destroy');


    // --- City Management (for Country List precision) ---
    Route::post('shipping/cities', [CityController::class, 'store'])->name('shipping.cities.store');
    Route::delete('shipping/cities/{city}', [CityController::class, 'destroy'])->name('shipping.cities.destroy');

    // --- Delivery Driver Agencies (Business registration & Fleet) ---
    Route::get('shipping/agencies', [DeliveryDriverAgencyController::class,'index'])->name('shipping.delivery-driver-agency');
    Route::post('shipping/agencies', [DeliveryDriverAgencyController::class,'store'])->name('shipping.delivery-driver-agency.store');
    Route::patch('shipping/agencies/{agency}', [DeliveryDriverAgencyController::class,'update'])->name('shipping.delivery-driver-agency.update');
    Route::delete('shipping/agencies/{agency}', [DeliveryDriverAgencyController::class,'destroy'])->name('shipping.delivery-driver-agency.destroy');


    Route::get('shipping/prices', [ShippingRateController::class, 'index'])->name('shipping.shipping-rates');
    Route::post('shipping/prices', [ShippingRateController::class, 'store'])->name('shipping.shipping-rates.store');
    Route::patch('shipping/prices/{shippingRate}', [ShippingRateController::class, 'update'])->name('shipping.shipping-rates.update');
    Route::delete('shipping/prices/{shippingRate}', [ShippingRateController::class, 'destroy'])->name('shipping.shipping-rates.destroy');

    Route::get('shipping/tariffs', [DeliveryTariffController::class, 'index'])->name('shipping.delivery-tariffs');
    Route::post('shipping/tariffs', [DeliveryTariffController::class, 'store'])->name('shipping.delivery-tariffs.store');
    Route::patch('shipping/tariffs/{deliveryTariff}', [DeliveryTariffController::class, 'update'])->name('shipping.delivery-tariffs.update');
    Route::delete('shipping/tariffs/{deliveryTariff}', [DeliveryTariffController::class, 'destroy'])->name('shipping.delivery-tariffs.destroy');



    Route::get('user/list', [UserController::class, 'index'])->name('user.index');

    Route::get('car/list', [CarController::class, 'index'])->name('car.index');
    Route::post('car/store', [CarController::class, 'store'])->name('car.store');
    Route::get('car/create', [CarController::class, 'create'])->name('car.create');
    Route::get('car/{car}/edit', [CarController::class, 'edit'])->name('car.edit');
    Route::post('car/{car}/update', [CarController::class, 'update'])->name('car.update');
    Route::delete('car/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    Route::get('car/{car}/show', [CarController::class, 'show'])->name('car.show');


    Route::get('management/module/list', [ModuleController::class, 'index'])->name('management.modules');
    Route::post('management/module/store', [ModuleController::class, 'store'])->name('management.modules.store');
    Route::delete('management/module/{module}', [ModuleController::class, 'destroy'])->name('management.modules.destroy');
    Route::patch('management/module/{module}', [ModuleController::class, 'update'])->name('management.modules.update');

    Route::get('management/permission/list', [PermissionController::class, 'index'])->name('management.permissions');
    Route::post('management/permission/store', [PermissionController::class, 'store'])->name('management.permissions.store');
    Route::delete('management/permission/{permission}', [PermissionController::class, 'destroy'])->name('management.permissions.destroy');
    Route::patch('management/permission/{permission}', [PermissionController::class, 'update'])->name('management.permissions.update');

    Route::get('management/role/list', [RoleController::class, 'index'])->name('management.roles');
    Route::post('management/role/store', [RoleController::class, 'store'])->name('management.roles.store');
    Route::delete('management/role/{role}', [RoleController::class, 'destroy'])->name('management.roles.destroy');
    Route::patch('management/role/{role}', [RoleController::class, 'update'])->name('management.roles.update');
    



    Route::get('/order/list', [OrderController::class, 'index'])->name('order.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('order.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatusManagement'])->name('order.update-status');


    Route::get('management/cars/search-brand', [CarController::class, 'searchByBrand'])->name('management.car.filter.brand');

});
});