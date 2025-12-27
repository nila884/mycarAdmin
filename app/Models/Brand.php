<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'brands';

    protected $fillable=[
        "brand_name",
        "logo",
    ];

      /**
     * A brand can have many car models.
     */
    public function carModels()
    {
        return $this->hasMany(carModel::class);
    }
    /**
     * A brand can have many cars.
     */
    public function cars()
    {
        return $this->hasMany(Car::class);          
    }
}