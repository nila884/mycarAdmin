<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Country extends Model
{
    use HasFactory;
    protected $fillable=[
        "country_name",
        "code",
        "prefix",
        "currency",
        "flags",
        "import_regulation_information"
    ];
    /**
     * Get all of the users for the Country
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class, 'country_id', 'id');
    }

    public function ports()
    {
        return $this->hasMany(Port::class);
    }

    public function gatewayPorts()
{
    return $this->belongsToMany(Port::class, 'country_gateway_port');
}
public function cities()
{
    return $this->hasMany(City::class);
}

protected $with = ['cities', 'gatewayPorts'];

}
