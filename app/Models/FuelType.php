<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FuelType extends Model
{
    use HasFactory;
    protected $table = 'fuel_types';
    protected $fillable=[
        "fuel_type",
    ];

    public function cars()
    {
        return $this->hasMany(Car::class);
    }
}
