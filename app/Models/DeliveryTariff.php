<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryTariff extends Model
{
    use HasFactory;

        protected $fillable = [
    'from_country_id', 'from_port_id', 'from_city_id',
    'country_id', 'to_city_id', 'adress_name',
    'service_type', 'delivery_method', 'delivery_driver_agency_id',
    'tarif_per_tone', 'driver_fee', 'clearing_fee', 'agency_service_fee', 'is_current',
];

    public function country(): BelongsTo {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function originPort(): BelongsTo {
        return $this->belongsTo(Port::class, 'from_port_id');
    }

    public function originCountry(): BelongsTo {
        return $this->belongsTo(Country::class, 'from_country_id');
    }

    public function fromCity() {
    return $this->belongsTo(City::class, 'from_city_id');
    }

    public function toCity() {
            return $this->belongsTo(City::class, 'to_city_id');
    }





public function deliveryDriverAgency() {
    return $this->belongsTo(DeliveryDriverAgency::class, 'delivery_driver_agency_id');
}

}