<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'order_number', 'total_price',
        'status', 'address', 'phone', 'notes', 'is_new',
        'payment_method','payment_authority','payment_ref_id'
        ,'discount_amount','final_price','total'
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'total_price' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}

