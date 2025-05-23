<?php

namespace App\Models;

use App\Models\Car;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class carModel extends Model
{
    use HasFactory;
    protected $fillable=[
        "model_name",
        "brand_id"
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function versions()
    {
        return $this->hasMany(Version::class);
    }
/**
 * Get all of the cars for the carModel
 *
 * @return \Illuminate\Database\Eloquent\Relations\HasMany
 */
public function cars()
{
    return $this->hasMany(Car::class, 'car_model_id', 'id'); 
}
}
