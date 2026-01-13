<?php
// app/Models/City.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'country_id', 'is_hub']; // Added to allow mass assignment

    public function country()
    {
        return $this->belongsTo(Country::class);
    }
}