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

Route::middleware(['auth', 'admin'])->group(function () {
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

    Route::get('car/settings/version', [VersionController::class, 'index'])->name('carversion.index');
    Route::post('car/settings/version', [VersionController::class, 'store'])->name('carversion.store');
    Route::patch('car/settings/version/{version}', [VersionController::class, 'update'])->name('carversion.update');
    Route::delete('car/settings/version/{version}', [VersionController::class, 'destroy'])->name('carversion.destroy');

    Route::get('car/settings/feature', [FeatureController::class, 'index'])->name('carfeature.index');
    Route::post('car/settings/feature', [FeatureController::class, 'store'])->name('carfeature.store');
    Route::patch('car/settings/feature/{feature}', [FeatureController::class, 'update'])->name('carfeature.update');
    Route::delete('car/settings/feature/{feature}', [FeatureController::class, 'destroy'])->name('carfeature.destroy');

    Route::get('car/settings/seller', [SellerController::class, 'index'])->name('carseller.index');
    Route::post('car/settings/seller', [SellerController::class, 'store'])->name('carseller.store');
    Route::patch('car/settings/seller/{seller}', [SellerController::class, 'update'])->name('carseller.update');
    Route::delete('car/settings/seller/{seller}', [SellerController::class, 'destroy'])->name('carseller.destroy');

    Route::get('shipping/countries/list', [CountryController::class, 'index'])->name('country.index');
    Route::post('shipping/countries', [CountryController::class, 'store'])->name('country.store');
    Route::patch('shipping/countries/{country}', [CountryController::class, 'update'])->name('country.update');
    Route::delete('shipping/countries/{country}', [CountryController::class, 'destroy'])->name('country.destroy');
    Route::post('countries/{country}/gateways', [CountryController::class, 'updateGateways'])->name('country.gateways.update');


    Route::get('shipping/ports/list', [PortController::class, 'index'])->name('port.index');
    Route::post('shipping/ports', [PortController::class, 'store'])->name('port.store');
    Route::patch('shipping/ports/{port}', [PortController::class, 'update'])->name('port.update');
    Route::delete('shipping/ports/{port}', [PortController::class, 'destroy'])->name('port.destroy');


    // --- City Management (for Country List precision) ---
    Route::post('/cities', [CityController::class, 'store'])->name('cities.store');
    Route::delete('/cities/{city}', [CityController::class, 'destroy'])->name('cities.destroy');

    // --- Delivery Driver Agencies (Business registration & Fleet) ---
    Route::get('shipping/agencies/list', [DeliveryDriverAgencyController::class,'index'])->name('delivery-driver-agency.index');
    Route::post('shipping/agencies', [DeliveryDriverAgencyController::class,'store'])->name('delivery-driver-agency.store');
    Route::patch('shipping/agencies/{agency}', [DeliveryDriverAgencyController::class,'update'])->name('delivery-driver-agency.update');
    Route::delete('shipping/agencies/{agency}', [DeliveryDriverAgencyController::class,'destroy'])->name('delivery-driver-agency.destroy');


    Route::get('shipping/prices/list', [ShippingRateController::class, 'index'])->name('shipping-rates.index');
    Route::post('shipping/prices', [ShippingRateController::class, 'store'])->name('shipping-rates.store');
    Route::patch('shipping/prices/{shippingRate}', [ShippingRateController::class, 'update'])->name('shipping-rates.update');
    Route::delete('shipping/prices/{shippingRate}', [ShippingRateController::class, 'destroy'])->name('shipping-rates.destroy');


    Route::get('shipping/tariffs/list', [DeliveryTariffController::class, 'index'])->name('delivery-tariffs.index');
    Route::post('shipping/tariffs', [DeliveryTariffController::class, 'store'])->name('delivery-tariffs.store');
    Route::patch('shipping/tariffs/{deliveryTariff}', [DeliveryTariffController::class, 'update'])->name('delivery-tariffs.update');
    Route::delete('shipping/tariffs/{deliveryTariff}', [DeliveryTariffController::class, 'destroy'])->name('delivery-tariffs.destroy');

    Route::get('car/settings/color', [ColorController::class, 'index'])->name('color.index');
    Route::post('car/settings/color', [ColorController::class, 'store'])->name('color.store');
    Route::patch('car/settings/color/{color}', [ColorController::class, 'update'])->name('color.update');
    Route::delete('car/settings/color/{color}', [ColorController::class, 'destroy'])->name('color.destroy');

    Route::get('user/list', [UserController::class, 'index'])->name('user.index');

    Route::get('car/list', [CarController::class, 'index'])->name('car.index');
    Route::post('car/store', [CarController::class, 'store'])->name('car.store');
    Route::get('car/create', [CarController::class, 'create'])->name('car.create');
    Route::get('car/{car}/edit', [CarController::class, 'edit'])->name('car.edit');
    Route::post('car/{car}/update', [CarController::class, 'update'])->name('car.update');
    Route::delete('car/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    Route::get('car/{car}/show', [CarController::class, 'show'])->name('car.show');


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
    
    
    Route::get('/order/list', [OrderController::class, 'index'])->name('order.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('order.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatusManagement'])->name('order.update-status');


    Route::get('management/cars/search-brand', [CarController::class, 'searchByBrand'])->name('management.car.filter.brand');

});
