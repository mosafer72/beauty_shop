<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // دسته‌بندی‌های اصلی
            [
                'id'          => 1,
                'name'        => 'مراقبت از پوست',
                'meta_title'        => 'مراقبت از پوست',
                'meta_desc'        => 'مراقبت از پوست',
                'slug'        => 'skin-care',
                'description' => 'محصولات مراقبت و درمان پوست',
                'image' => 'test',
                'parent_id'   => 0,
                'sort_order'  => 1,
                'is_active'   => true,
            ],
            [
                'id'          => 2,
                'name'        => 'آرایشی',
                'meta_title'        => 'آرایشی',
                'meta_desc'        => 'آرایشی',
                'slug'        => 'makeup',
                'description' => 'محصولات آرایش صورت',
                'parent_id'   => 0,
                'image' => 'test',
                'sort_order'  => 2,
                'is_active'   => true,
            ],
            [
                'id'          => 3,
                'name'        => 'مراقبت از مو',
                'meta_title'        => 'مراقبت از مو',
                'meta_desc'        => 'مراقبت از مو',
                'slug'        => 'hair-care',
                'description' => 'شامپو، نرم‌کننده و محصولات مو',
                'parent_id'   => 0,
                'image' => 'test',
                'sort_order'  => 3,
                'is_active'   => true,
            ],
            [
                'id'          => 4,
                'name'        => 'عطر و ادکلن',
                'meta_title'        => 'عطر و ادکلن',
                'meta_desc'        => 'عطر و ادکلن',
                'slug'        => 'perfume',
                'description' => 'انواع عطر و ادکلن',
                'parent_id'   => 0,
                'image' => 'test',
                'sort_order'  => 4,
                'is_active'   => true,
            ],
            [
                'id'          => 5,
                'name'        => 'بهداشت شخصی',
                'meta_title'        => 'بهداشت شخصی',
                'meta_desc'        => 'بهداشت شخصی',
                'slug'        => 'personal-hygiene',
                'description' => 'محصولات بهداشتی',
                'parent_id'   => 0,
                'image' => 'test',
                'sort_order'  => 5,
                'is_active'   => true,
            ],

            // زیردسته‌های مراقبت از پوست
            [
                'id'          => 6,
                'name'        => 'کرم مرطوب‌کننده',
                'meta_title'        => 'کرم مرطوب‌کننده',
                'meta_desc'        => 'کرم مرطوب‌کننده',
                'slug'        => 'moisturizer',
                'description' => 'انواع کرم مرطوب‌کننده',
                'parent_id'   => 1,
                'image' => 'test',
                'sort_order'  => 1,
                'is_active'   => true,
            ],
            [
                'id'          => 7,
                'name'        => 'ضد آفتاب',
                'meta_title'        => 'ضد آفتاب',
                'meta_desc'        => 'ضد آفتاب',
                'slug'        => 'sunscreen',
                'description' => 'کرم‌های ضد آفتاب',
                'parent_id'   => 1,
                'image' => 'test',
                'sort_order'  => 2,
                'is_active'   => true,
            ],
            [
                'id'          => 8,
                'name'        => 'پاک‌کننده پوست',
                'meta_title'        => 'پاک‌کننده پوست',
                'meta_desc'        => 'پاک‌کننده پوست',

                'slug'        => 'cleanser',
                'description' => 'انواع پاک‌کننده و فوم شستشو',
                'parent_id'   => 1,
                'image' => 'test',
                'sort_order'  => 3,
                'is_active'   => true,
            ],

            // زیردسته‌های آرایشی
            [
                'id'          => 9,
                'name'        => 'رژ لب',
                'meta_title'        => 'رژ لب',
                'meta_desc'        => 'رژ لب',

                'slug'        => 'lipstick',
                'description' => 'انواع رژ لب و رنگ لب',
                'parent_id'   => 2,
                'image' => 'test',
                'sort_order'  => 1,
                'is_active'   => true,
            ],
            [
                'id'          => 10,
                'name'        => 'ریمل',
                'meta_title'        => 'ریمل',
                'meta_desc'        => 'ریمل',
                'slug'        => 'mascara',
                'description' => 'ریمل و محصولات چشم',
                'parent_id'   => 2,
                'image' => 'test',
                'sort_order'  => 2,
                'is_active'   => true,
            ],
            [
                'id'          => 11,
                'name'        => 'کرم پودر',
                'meta_title'        => 'ماسک مو',
                'meta_desc'        => 'ماسک مو',
                'slug'        => 'foundation',
                'description' => 'کرم پودر و بیس آرایش',
                'parent_id'   => 2,
                'image' => 'test',
                'sort_order'  => 3,
                'is_active'   => true,
            ],

            // زیردسته‌های مراقبت از مو
            [
                'id'          => 12,
                'name'        => 'شامپو',
                'meta_title'        => 'شامپو',
                'meta_desc'        => 'شامپو',
                'slug'        => 'shampoo',
                'description' => 'انواع شامپو',
                'parent_id'   => 3,
                'image' => 'test',
                'sort_order'  => 1,
                'is_active'   => true,
            ],
            [
                'id'          => 13,
                'name'        => 'ماسک مو',
                'meta_title'        => 'ماسک مsdfو',
                'meta_desc'        => 'ماسک موdsf',
                'slug'        => 'hair-mask',
                'description' => 'ماسک و کراتین مو',
                'parent_id'   => 3,
                'image' => 'test',
                'sort_order'  => 2,
                'is_active'   => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('✅ Categories seeded: 5 main + 8 sub categories');
    }
}



