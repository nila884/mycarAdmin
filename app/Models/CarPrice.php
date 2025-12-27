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
        return round($this->price, 2);
    }

    $finalPrice = $this->price;

    if ($this->discount_type === 'percent') {
        $finalPrice = $this->price - ($this->price * $this->discount / 100);
    } elseif ($this->discount_type === 'amount') {
        $finalPrice = $this->price - $this->discount;
    } else {
        $finalPrice = $this->price - $this->discount;
    }
    return round(max(0, $finalPrice), 0);
    }
}
