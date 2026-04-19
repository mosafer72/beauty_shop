<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'usd_price',
        'socials',
        'phone',
        'mobile',
        'address',
        'about_us',
    ];

    protected $casts = [
        'socials' => 'array',
        'usd_price' => 'decimal:2',
    ];
}
