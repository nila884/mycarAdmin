<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnginePower extends Model
{
    use HasFactory;
    protected $table = 'engine_powers';
    protected $fillable=[
        "power",
    ];

    public function cars()
    {
        return $this->hasMany(Car::class);
    }
}
