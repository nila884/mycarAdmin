<?php

namespace App\Models;

use App\Models\Brand;
use App\Models\Image;
use App\Models\Feature;
use App\Models\Version;
use App\Models\carModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\CarPrice;
use App\Models\Category;
use App\Models\EnginePower;
use App\Models\FuelType;
use App\Models\Seller;

class Car extends Model
{
    use HasFactory;
    protected $fillable=[
        "id",
        "car_model_id",
        "category_id", 
        "fuel_type_id",
        "version_id",
        "seller_id",
        "mileage",
        "chassis_number",
        "registration_year",
        "manufacture_year",
        "color",
        "weight",
        "price",
        "status",
        "transmission",
        "streering",
        "steating_capacity",
        "engine_code",
        "engine_size",
        "model_code",
        "wheel_driver",
        "m_3",
        "doors",
        "location",
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function carModel()
    {
        return $this->belongsTo(carModel::class);
    }

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
        return $this->hasMany(Image::class,'car_id','id');
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

}
