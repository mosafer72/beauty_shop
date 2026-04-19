<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // مراقبت از پوست
            [
                'name'              => 'کرم مرطوب‌کننده نیوآ',
                'slug'              => 'nivea-moisturizer',
                'description'       => 'کرم مرطوب‌کننده نیوآ مناسب برای پوست‌های خشک و نرمال. حاوی آلوئه‌ورا و ویتامین E. این کرم پوست شما را تا ۲۴ ساعت مرطوب نگه می‌دارد.',
                'short_description' => 'مرطوب‌کننده ۲۴ ساعته مناسب تمام پوست‌ها',
                'price'             => 85000,
                'stock'             => 50,
                'category_id'       => 6,
                'brand'             => 'Nivea',
                'is_active'         => true,
                'rating'            => 4.5,
                'rating_count'      => 128,
            ],
            [
                'name'              => 'ضد آفتاب SPF50 لاروش‌پوزه',
                'slug'              => 'laroche-sunscreen-spf50',
                'description'       => 'کرم ضد آفتاب لاروش‌پوزه با SPF50 محافظت کامل در برابر اشعه UVA و UVB. مناسب برای پوست‌های حساس. فرمول سبک و غیر چرب.',
                'short_description' => 'محافظت کامل در برابر آفتاب SPF50',
                'price'             => 320000,
                'stock'             => 30,
                'category_id'       => 7,
                'brand'             => 'La Roche-Posay',
                'is_active'         => true,
                'rating'            => 4.8,
                'rating_count'      => 256,
            ],
            [
                'name'              => 'فوم شستشوی صورت سریتا',
                'slug'              => 'cerita-face-wash',
                'description'       => 'فوم شستشوی ملایم سریتا مناسب برای پوست‌های چرب و مختلط. پاک‌کننده قوی چربی و آلودگی بدون خشک کردن پوست.',
                'short_description' => 'پاک‌کننده ملایم مناسب پوست چرب',
                'price'             => 145000,
                'stock'             => 75,
                'category_id'       => 8,
                'brand'             => 'Cerita',
                'is_active'         => true,
                'rating'            => 4.2,
                'rating_count'      => 89,
            ],
            [
                'name'              => 'سرم ویتامین C اوله',
                'slug'              => 'olay-vitamin-c-serum',
                'description'       => 'سرم درخشان‌کننده ویتامین C اوله برای روشن‌سازی و یکدست کردن رنگ پوست. حاوی ۱۰٪ ویتامین C خالص.',
                'short_description' => 'روشن‌کننده و درخشان‌کننده پوست',
                'price'             => 275000,
                'stock'             => 40,
                'category_id'       => 1,
                'brand'             => 'Olay',
                'is_active'         => true,
                'rating'            => 4.6,
                'rating_count'      => 175,
            ],

            // آرایشی
            [
                'name'              => 'رژ لب مایع مات مک',
                'slug'              => 'mac-liquid-lipstick-red',
                'description'       => 'رژ لب مایع مات مک در رنگ قرمز کلاسیک. ماندگاری بالا تا ۸ ساعت. فرمول سبک و راحت روی لب.',
                'short_description' => 'رژ لب مات ماندگار تا ۸ ساعت',
                'price'             => 185000,
                'stock'             => 60,
                'category_id'       => 9,
                'brand'             => 'MAC',
                'is_active'         => true,
                'rating'            => 4.7,
                'rating_count'      => 312,
            ],
            [
                'name'              => 'رژ لب مایع مات مک - رنگ صورتی',
                'slug'              => 'mac-liquid-lipstick-pink',
                'description'       => 'رژ لب مایع مات مک در رنگ صورتی ملایم. مناسب برای استفاده روزانه.',
                'short_description' => 'رژ لب مات صورتی ملایم',
                'price'             => 185000,
                'stock'             => 45,
                'category_id'       => 9,
                'brand'             => 'MAC',
                'is_active'         => true,
                'rating'            => 4.4,
                'rating_count'      => 198,
            ],
            [
                'name'              => 'ریمل حجم‌دهنده مایبلین',
                'slug'              => 'maybelline-mascara-volume',
                'description'       => 'ریمل حجم‌دهنده مایبلین با فرمول مخصوص برای مژه‌های حجیم و پرپشت. ضد آب و ماندگار.',
                'short_description' => 'مژه‌های حجیم و پرپشت ضد آب',
                'price'             => 125000,
                'stock'             => 80,
                'category_id'       => 10,
                'brand'             => 'Maybelline',
                'is_active'         => true,
                'rating'            => 4.3,
                'rating_count'      => 421,
            ],
            [
                'name'              => 'کرم پودر کاورگرل',
                'slug'              => 'covergirl-foundation',
                'description'       => 'کرم پودر مایع کاورگرل با پوشش کامل و ماندگاری ۱۲ ساعته. مناسب تمام انواع پوست. ۲۰ رنگ مختلف.',
                'short_description' => 'پوشش کامل ۱۲ ساعته',
                'price'             => 210000,
                'stock'             => 35,
                'category_id'       => 11,
                'brand'             => 'CoverGirl',
                'is_active'         => true,
                'rating'            => 4.1,
                'rating_count'      => 156,
            ],

            // مراقبت از مو
            [
                'name'              => 'شامپو ضد ریزش هِد اند شولدرز',
                'slug'              => 'head-shoulders-anti-fall',
                'description'       => 'شامپو ضد ریزش هد اند شولدرز با فرمول پیشرفته برای تقویت ریشه مو و جلوگیری از ریزش. حاوی زینک پیریتیون.',
                'short_description' => 'جلوگیری از ریزش مو و تقویت ریشه',
                'price'             => 95000,
                'stock'             => 100,
                'category_id'       => 12,
                'brand'             => 'Head & Shoulders',
                'is_active'         => true,
                'rating'            => 4.0,
                'rating_count'      => 543,
            ],
            [
                'name'              => 'ماسک موی کراتینه لورال',
                'slug'              => 'loreal-keratin-mask',
                'description'       => 'ماسک موی کراتینه لورال برای ترمیم و تقویت موهای آسیب‌دیده. حاوی کراتین و پروتئین مو. استفاده هفتگی توصیه می‌شود.',
                'short_description' => 'ترمیم عمیق موهای آسیب‌دیده',
                'price'             => 165000,
                'stock'             => 55,
                'category_id'       => 13,
                'brand'             => "L'Oreal",
                'is_active'         => true,
                'rating'            => 4.6,
                'rating_count'      => 287,
            ],

            // عطر
            [
                'name'              => 'عطر زنانه چنل شانس',
                'slug'              => 'chanel-chance-perfume',
                'description'       => 'عطر زنانه چنل شانس با رایحه گل‌های تازه و چوبی. ماندگاری بالا تا ۱۲ ساعت. حجم ۱۰۰ میلی‌لیتر.',
                'short_description' => 'رایحه شاداب و ماندگار',
                'price'             => 1850000,
                'stock'             => 20,
                'category_id'       => 4,
                'brand'             => 'Chanel',
                'is_active'         => true,
                'rating'            => 4.9,
                'rating_count'      => 89,
            ],
            [
                'name'              => 'ادکلن مردانه دیور سووآژ',
                'slug'              => 'dior-sauvage-cologne',
                'description'       => 'ادکلن مردانه دیور سووآژ با رایحه تازه و اسپایسی. یکی از محبوب‌ترین عطرهای مردانه دنیا. حجم ۱۰۰ میلی‌لیتر.',
                'short_description' => 'رایحه قوی و جذاب مردانه',
                'price'             => 2100000,
                'stock'             => 15,
                'category_id'       => 4,
                'brand'             => 'Dior',
                'is_active'         => true,
                'rating'            => 4.8,
                'rating_count'      => 134,
            ],

            // بهداشت
            [
                'name'              => 'دئودورانت نیوآ مردانه',
                'slug'              => 'nivea-men-deodorant',
                'description'       => 'دئودورانت رول‌آن نیوآ مردانه با محافظت ۴۸ ساعته. ضد عرق و ضد بو. مناسب پوست‌های حساس.',
                'short_description' => 'محافظت ۴۸ ساعته ضد عرق',
                'price'             => 65000,
                'stock'             => 120,
                'category_id'       => 5,
                'brand'             => 'Nivea',
                'is_active'         => true,
                'rating'            => 4.2,
                'rating_count'      => 367,
            ],
            // محصول غیرفعال برای تست
            [
                'name'              => 'محصول تست غیرفعال',
                'slug'              => 'test-inactive-product',
                'description'       => 'این محصول برای تست غیرفعال بودن است',
                'short_description' => 'محصول غیرفعال',
                'price'             => 50000,
                'stock'             => 0,
                'category_id'       => 5,
                'brand'             => 'Test',
                'is_active'         => false,
                'rating'            => 0,
                'rating_count'      => 0,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        $this->command->info('✅ Products seeded: 13 products (12 active + 1 inactive)');
    }
}
