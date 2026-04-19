<?php

namespace Database\Seeders;

use App\Models\MainSlider;
use Illuminate\Database\Seeder;
use App\Models\Slider;

class SliderSeeder extends Seeder
{
    public function run(): void
    {
        MainSlider::insert([
            [
                'title' => 'تخفیف ویژه محصولات آرایشی',
                'description' => 'تا 40 درصد تخفیف روی برندهای محبوب',
                'image' => 'sliders/slider1.jpg',
                'link' => '/products',
                'order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'محصولات جدید مراقبت پوست',
                'description' => 'جدیدترین محصولات مراقبت از پوست را ببینید',
                'image' => 'sliders/slider2.jpg',
                'link' => '/categories/skincare',
                'order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'پرفروش‌ترین لوازم آرایش',
                'description' => 'محصولاتی که همه دوست دارند',
                'image' => 'sliders/slider3.jpg',
                'link' => '/products/best-sellers',
                'order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'عطرهای خاص و ماندگار',
                'description' => 'کلکسیونی از بهترین عطرها',
                'image' => 'sliders/slider4.jpg',
                'link' => '/categories/perfume',
                'order' => 4,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
