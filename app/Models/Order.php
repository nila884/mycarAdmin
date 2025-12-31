<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'car_id', 'shipping_rate_id', 'delivery_tariff_id',
        'fob_price', 'sea_freight', 'land_transit', 'clearing_fee', 'total_amount',
        'origin_port', 'destination_port', 'final_destination_city',
        'status', 'delivery_status', 'expires_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function car(): BelongsTo {
        return $this->belongsTo(Car::class);
    }

    public function invoice(): HasOne {
        return $this->hasOne(Invoice::class);
    }
}