<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Seller extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'seller_name',
        'phone',
        'user_id',
        'description',
        'address',
        'country',
        'avatar',
        'user',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
