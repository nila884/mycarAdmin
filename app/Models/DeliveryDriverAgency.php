<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryDriverAgency extends Model
{
    use HasFactory;
    protected $fillable = [
    'name', 'business_registration_number', 'tax_identification_number', 
    'contact_person', 'phone', 'email', 'address', 'fleet_size', 'is_active'
];

public function tariffs() {
    return $this->hasMany(DeliveryTariff::class, 'delivery_driver_agency_id');
}
}
