<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'category_id',
        'fuel_type_id',
        'version_id',
        'seller_id',
        'mileage',
        'chassis_number',
        'registration_year',
        'manufacture_year',
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


}
