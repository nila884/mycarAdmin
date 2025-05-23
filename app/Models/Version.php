<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Version extends Model
{
    use HasFactory;
    protected $fillable=[
        "car_model_id",
        "version_name",
        "version_year"
    ];

    public function carModel()
    {
        return $this->belongsTo(carModel::class);
    }
}
