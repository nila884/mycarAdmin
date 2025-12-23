<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShippingRate extends Model
{
        use HasFactory;

    protected $fillable = [
        'transport_mode',
        'from_country_id',
        'from_port_id',
        'to_country_id',
        'to_port_id',
        'price_roro',
        'price_container',
        'is_current',
        'created_at',
        'updated_at'


    ];

    public function originCountry()
    {
        return $this->belongsTo(Country::class,'from_country_id');
    }
    public function originPort()
    {
        return $this->belongsTo(Port::class,'from_port_id');
    }
        public function destinationCountry()
    {
        return $this->belongsTo(Country::class,'to_country_id');
    }

    public function destinationPort()
    {
        return $this->belongsTo(Port::class,'to_port_id');
    }
    
}
