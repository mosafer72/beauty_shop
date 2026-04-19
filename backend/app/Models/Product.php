<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'short_description',
        'price',
        'discount_price',
        'image',
        'images',
        'stock',
        'is_active',
        'rating',
        'rating_count',
        'brand'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'images' => 'array',
        'price' => 'integer',
        'discount_price' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->where('status', 'approved');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->discount_price ?? $this->price;
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

}
