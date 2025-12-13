<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seller extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_name',
        'phone',
        'user_id',
        'description',
        'address',
        'country',
        'avatar',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
