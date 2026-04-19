<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        Brand::insert([
            [
                'name' => 'Maybelline',
                'slug' => 'maybelline',
                'logo' => 'brands/maybelline.png',
                'description' => 'برند معروف لوازم آرایش آمریکایی با کیفیت بالا',
                'is_active' => true,
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'L’Oreal',
                'slug' => 'loreal',
                'logo' => 'brands/loreal.png',
                'description' => 'یکی از بزرگ‌ترین برندهای زیبایی در جهان',
                'is_active' => true,
                'order' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'The Ordinary',
                'slug' => 'the-ordinary',
                'logo' => 'brands/the-ordinary.png',
                'description' => 'محصولات مراقبت پوست با فرمول‌های ساده و مؤثر',
                'is_active' => true,
                'order' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nivea',
                'slug' => 'nivea',
                'logo' => 'brands/nivea.png',
                'description' => 'برند آلمانی محبوب برای مراقبت پوست و بدن',
                'is_active' => true,
                'order' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
