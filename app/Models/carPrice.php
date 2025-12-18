<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CarPrice extends Model
{
    use HasFactory;

    protected $fillable = ['car_id', 'price', 'discount', 'discount_type', 'is_current'];

    public function car()
    {
        return $this->belongsTo(Car::class);
    }

    public function getFinalPrice()
    {

        if (! $this->discount || ! $this->discount_type) {
            return $this->price;
        }

        if ($this->discount_type === 'percent') {
            return $this->price - ($this->price * $this->discount / 100);
        }
        if ($this->discount_type === 'amount') {
            return max(0, $this->price - $this->discount);
        }

        return $this->price - $this->discount;
    }
}
