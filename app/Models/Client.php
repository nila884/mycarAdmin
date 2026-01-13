<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{

    use HasFactory;
    use SoftDeletes;
    /**
     * The attributes that are mass assignable.
     * These match the fields you requested: Country, City, Address, Tel.
     */
    protected $fillable = [
        'user_id',
        'country',
        'city',
        'address',
        'phone', 
    ];

    /**
     * Get the user that owns the client profile.
     */
    public function user(): BelongsTo
    {
      
        return $this->belongsTo(User::class);
    }

public function favoriteCars()
{
    return $this->belongsToMany(Car::class, 'favorites', 'client_id', 'car_id')->withTimestamps();
}

}