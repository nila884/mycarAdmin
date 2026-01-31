<?php

use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\CarController;
use App\Http\Controllers\CarFilterController;
use App\Http\Controllers\CarMetaController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientAuthController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\DeliveryTariffController;
use App\Http\Controllers\FeatureController;
use App\Http\Controllers\FuelController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PortController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\ShippingRateController;
use App\Http\Controllers\VersionController;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {

Route::get('brands', [BrandController::class, 'apiIndex'])->name('api.brands');
Route::get('fuels', [FuelController::class, 'apiIndex'])->name('api.fuels');
Route::get('categories', [CategoryController::class, 'apiIndex'])->name('api.categories');
Route::get('models', [ModelController::class, 'apiIndex'])->name('api.models');
Route::get('versions', [VersionController::class, 'apiIndex'])->name('api.versions');
Route::get('features', [FeatureController::class, 'apiIndex'])->name('api.features');
Route::get('features/main', [FeatureController::class, 'apiFeatureMain'])->name('api.features.main');

Route::get('seller-infos/{id}', [SellerController::class, 'apiSellerProfile'])->name('api.seller.infos');

Route::get('seller-cars/{id}', [CarController::class, 'getCarsBySellerId'])->name('api.seller.cars');
Route::get('/cars/filters', [CarFilterController::class, 'index']);
Route::get('/brands/{brand}/models', [CarMetaController::class, 'modelsByBrand']);
Route::get('/models/{model}/versions', [CarMetaController::class, 'versionsByModel']);


Route::get('cars-search', [CarController::class, 'carsSearch'])->name('api.cars.search');
Route::get('cars/recomended', [CarController::class, 'carRecomended'])->name('api.cars.recomanded');

Route::get('cars/home', [CarController::class, 'carsHome'])->name('api.cars.home');


Route::get('cars/detail/{id}', [CarController::class, 'carDetail'])->name('api.cars.detail');

Route::get('m/cars/home', [CarController::class, 'carsHomeMobile'])->name('api.cars.home.mobile');

Route::get('shipping-details/tariffs', [DeliveryTariffController::class, 'apiGetDeliveryTariffsClient'])->name('api.cars.delivery.tariffs');
Route::get('shipping-details/rates', [ShippingRateController::class, 'apiGetShippingRatesClient'])->name('api.cars.shipping.rate');
Route::get('countries', [CountryController::class, 'apiGetCountriesClient'])->name('api.countries');
Route::get('ports', [PortController::class, 'apiIndex'])->name('api.ports');


Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);

Route::post('/client/favorites/objects/guest-list', [FavoriteController::class, 'getGuestObjects']);

Route::middleware(['auth:sanctum', 'role:user'])->group(function () {
Route::post('/orders/quotes/request', [OrderController::class, 'store']);
Route::get('/orders/client/list', [OrderController::class, 'getUserOrders']);
Route::post('/orders/client/{id}/confirm', [OrderController::class, 'confirmOrder']);
Route::post('/orders/client/{id}/cancel', [OrderController::class, 'cancelOrder']);

Route::get('/orders/client/{id}/download', [OrderController::class, 'downloadInvoice']);
Route::get('/client/infos', [ClientAuthController::class, 'show']);
Route::patch('/client/infos/update', [ClientAuthController::class, 'updateField']);
Route::patch('/client/password/update', [ClientAuthController::class, 'updatePassword']);

Route::post('/client/favorites/toggle', [FavoriteController::class, 'toggle']);
Route::get('/client/favorites/ids', [FavoriteController::class, 'index']);
Route::get('/client/favorites/objects', [FavoriteController::class, 'listObjects']);

Route::post('/client/favorites/sync', [FavoriteController::class, 'sync']);

Route::post('/client/logout', [ClientAuthController::class, 'logout']);
});

});