<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'phone',
        'password',
        'role',
        'is_active',
        'otp_code',
        'otp_expires_at'
    ];

    protected $hidden = ['password', 'remember_token', 'otp_code'];

    protected $casts = [
        'is_active' => 'boolean',
        'otp_expires_at' => 'datetime',
    ];

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'to_user_id');
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
