<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Car;


class CarPrice extends Model
{
    protected $fillable = ['car_id', 'price', 'discount', 'discount_type', 'is_current'];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function getFinalPriceAttribute()
    {
        if (!$this->discount || !$this->discount_type) {
            return $this->price;
        }

        if ($this->discount_type === 'percent') {
            return $this->price - ($this->price * $this->discount / 100);
        }

        return $this->price - $this->discount;
    }
}
