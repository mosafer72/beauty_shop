<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'ip_address', 'url',
        'method', 'user_agent', 'payload'
    ];

    protected $casts = ['payload' => 'array'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
