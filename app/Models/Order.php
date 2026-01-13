<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

class Order extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        'order_number', 'user_id', 'car_id', 'shipping_rate_id', 'delivery_tariff_id',
        'fob_price', 'sea_freight', 'land_transit', 'clearing_fee', 'total_amount',
        'origin_port', 'destination_port', 'final_destination_city',
        'status', 'delivery_status', 'expires_at','benefit'
    ];


    public function scopeMine(Builder $query): Builder
    {
        if (!Auth::check()) {
            return $query->where('id', 0); 
        }
        if (Auth::user()->hasRole('admin')) {
            return $query;
        }
        return $query->where('user_id', Auth::id());
    }

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