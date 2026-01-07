<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id', 'invoice_number', 'amount_due', 'pdf_path', 'status'
    ];

    public function order(): BelongsTo {
        return $this->belongsTo(Order::class);
    }
}