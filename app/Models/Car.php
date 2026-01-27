<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Car extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'id',
        'category_id',
        'fuel_type_id',
        'version_id',
        'seller_id',
        'mileage',
        'chassis_number',
        'registration_year',
        'manifactured_year',
        'car_selling_status',
        'weight',
        'status',
        'transmission',
        'steering',
        'seating_capacity',
        'publication_status',
        'engine_code',
        'engine_size',
        'model_code',
        'wheel_driver',
        'm_3',
        'doors',
        'location',
        'dimensions',
        'exterior_color_id',
        'interior_color_id',
        'origin_country_id',
        'cost_price',
        'min_profit_margin'


    ];

    /**
     * @var array
     */
    protected $casts = [

        'dimensions' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function enginePower()
    {
        return $this->belongsTo(EnginePower::class);
    }

    public function fuelType()
    {
        return $this->belongsTo(FuelType::class);
    }

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'car_id', 'id');
    }

    public function seller()
    {
        return $this->belongsTo(Seller::class);
    }

    public function features()
    {
        return $this->belongsToMany(Feature::class, 'car_features', 'car_id', 'feature_id');
    }

    public function prices()
    {
        return $this->hasMany(CarPrice::class);
    }

    public function currentPrice()
    {
        return $this->hasOne(CarPrice::class)->where('is_current', true);
    }

    public function imageMain()
    {
        return $this->hasOne(Image::class)->where('is_main', true);
    }

    public function interiorColor()
    {
        return $this->belongsTo(Color::class);
    }

    public function exteriorColor()
    {
        return $this->belongsTo(Color::class);
    }

        public function originCountry()
    {
        return $this->belongsTo(Country::class,'origin_country_id');
    }

    public function favoritedBy()
{
    return $this->belongsToMany(Client::class, 'favorites', 'car_id', 'client_id');
}


public function getIsPriceHealthyAttribute(): bool
{
    $currentPrice = $this->currentPrice();
    if (!$currentPrice) return false;

    $discountedPrice = $currentPrice->discount_type === 'percent' 
        ? $currentPrice->price * (1 - ($currentPrice->discount / 100))
        : $currentPrice->price - $currentPrice->discount;

    return $discountedPrice >= ($this->cost_price + $this->min_profit_margin);
}


 /* ==========================
     | BASE VISIBILITY
     ========================== */

    public function scopeVisible(Builder $q): Builder
    {
        return $q
            ->where('publication_status', 'published')
            ->where('car_selling_status', 'selling');
    }

    /* ==========================
     | FILTER SCOPES
     ========================== */

    public function scopeBrand(Builder $q, $brandId): Builder
    {
        return $q->whereHas(
            'version.carModel.brand',
            fn ($q) => $q->where('id', $brandId)
        );
    }

    public function scopeModel(Builder $q, $modelId): Builder
    {
        return $q->whereHas(
            'version.carModel',
            fn ($q) => $q->where('id', $modelId)
        );
    }

    public function scopeVersion(Builder $q, $versionId): Builder
    {
        return $q->where('version_id', $versionId);
    }

    public function scopeCategories(Builder $q, $ids): Builder
    {
        return $q->whereIn('category_id', explode(',', $ids));
    }

    public function scopeFuels(Builder $q, $ids): Builder
    {
        return $q->whereIn('fuel_type_id', explode(',', $ids));
    }

    public function scopeTransmission(Builder $q, $value): Builder
    {
        return $q->where('transmission', $value);
    }

    public function scopeSteering(Builder $q, $value): Builder
    {
        return $q->where('steering', $value);
    }

    public function scopePriceBetween(
        Builder $q,
        $min,
        $max
    ): Builder {
        return $q->whereHas('currentPrice', function ($q) use ($min, $max) {
            if ($min) $q->where('final_price', '>=', $min);
            if ($max) $q->where('final_price', '<=', $max);
        });
    }

public function scopeMileageBetween(
    Builder $q,
    $min,
    $max
): Builder {
    if ($min) {
        $q->where('mileage', '>=', $min);
    }

    if ($max) {
        $q->where('mileage', '<=', $max);
    }

    return $q;
}

public function scopeManufacturedYearBetween(
    Builder $q,
    $min,
    $max
): Builder {
    if ($min) {
        $q->where('manifactured_year', '>=', $min);
    }

    if ($max) {
        $q->where('manifactured_year', '<=', $max);
    }

    return $q;
}


public function scopeWithFeatures($query, $featureIds, bool $matchAll = false)
{
    if (is_string($featureIds)) {
        $featureIds = explode(',', $featureIds);
    }

    if (empty($featureIds)) {
        return $query;
    }

    if ($matchAll) {
        return $query->whereHas(
            'features',
            fn ($q) => $q->whereIn('features.id', $featureIds),
            '=',
            count($featureIds)
        );
    }

    return $query->whereHas('features', function ($q) use ($featureIds) {
        $q->whereIn('features.id', $featureIds);
    });
}


    /* ==========================
     | SORTING
     ========================== */

    public function scopeSort(Builder $q, ?string $sort): Builder
    {
        return match ($sort) {
            'price_asc' => $q->join('car_prices', fn ($j) =>
                $j->on('cars.id', '=', 'car_prices.car_id')
                  ->where('car_prices.is_current', true)
            )->orderBy('car_prices.final_price', 'asc'),

            'price_desc' => $q->join('car_prices', fn ($j) =>
                $j->on('cars.id', '=', 'car_prices.car_id')
                  ->where('car_prices.is_current', true)
            )->orderBy('car_prices.final_price', 'desc'),

            'mileage_asc' => $q->orderBy('mileage', 'asc'),
            'mileage_desc' => $q->orderBy('mileage', 'desc'),
            'year_asc' => $q->orderBy('manifactured_year', 'asc'),
            'year_desc' => $q->orderBy('manifactured_year', 'desc'),
            default => $q->latest('cars.created_at'),
        };
    }

}
