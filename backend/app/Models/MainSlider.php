<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes; // اگر تاریخ حذف می‌خواهی

class MainSlider extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'order', // برای تعیین ترتیب نمایش اسلایدها
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    // اگر SoftDeletes استفاده می‌کنی، این خط را هم اضافه کن
    // protected $dates = ['deleted_at'];
}
