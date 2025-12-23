<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Country;

class Port extends Model
{
       use HasFactory;
    protected $fillable=[
        "id",
       "name",
       "code",
       "country_id"       
    ];


public function country()
    {
        return $this->belongsTo(Country::class);
    }

public function currentShippingCost()
    {
        // This is a HasOne relationship constrained to only fetch the record where is_current is true (or 1)
        return $this->hasOne(ShippingRate::class)
                    ->where('is_current', 1);
    }
public function servedCountries()
{
    return $this->belongsToMany(Country::class, 'country_gateway_port');
}

}
