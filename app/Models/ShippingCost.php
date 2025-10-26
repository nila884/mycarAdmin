<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Port;

class ShippingCost extends Model
{
           use HasFactory;
    protected $fillable=[
       "price",
       "is_current",
       "port_id"       
    ];

            public function Port()
    {
        return $this->belongsTo(Port::class);
    }
}
