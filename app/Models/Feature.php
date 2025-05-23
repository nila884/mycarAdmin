<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasFactory;
    protected $fillable=[
        "feature_name",
        "description",
        "icon",        
    ];

    public function cars()
    {
        return $this->belongsToMany(Car::class);
    }
}
