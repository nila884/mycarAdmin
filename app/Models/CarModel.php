<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class carModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_name',
        'brand_id',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function versions()
    {
        return $this->hasMany(Version::class);
    }
}
