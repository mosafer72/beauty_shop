<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $comments = [
            // نظرات تایید شده
            [
                'user_id'    => 3,
                'product_id' => 1,
                'rating'     => 5,
                'title'      => 'عالی بود!',
                'body'       => 'این کرم خیلی خوبه، پوستم خیلی نرم شد. حتماً دوباره میخرم.',
                'status'     => 'approved',
                'parent_id'=> null,
            ],
            [
                'user_id'    => 4,
                'product_id' => 1,
                'rating'     => 4,
                'title'      => 'خوب ولی گران',
                'body'       => 'کیفیت خوبیه ولی قیمتش یه کم بالاست. بوی خوبی داره.',
                'status'     => 'approved',
                'parent_id'=> null,
            ],
            [
                'user_id'    => 5,
                'product_id' => 2,
                'rating'     => 5,
                'title'      => 'بهترین ضد آفتاب',
                'body'       => 'از لاروش پوزه خیلی راضیم. پوستم خیلی حساسه و این ضد آفتاب اصلاً حساسیت نداد.',
                'status'     => 'approved',
                'parent_id'=> 1,
            ],
            [
                'user_id'    => 6,
                'product_id' => 5,
                'rating'     => 5,
                'title'      => 'رنگ فوق‌العاده',
                'body'       => 'رنگ قرمزش خیلی قشنگه و ماندگاری عالی داره. به همه پیشنهاد میدم.',
                'status'     => 'approved',
                'parent_id'=> null,
            ],
            [
                'user_id'    => 8,
                'product_id' => 7,
                'rating'     => 4,
                'title'      => 'ریمل خوب',
                'body'       => 'حجم خوبی به مژه‌ها میده ولی یه کم پخش میشه.',
                'status'     => 'approved',
                'parent_id'=> null,
            ],
            [
                'user_id'    => 9,
                'product_id' => 10,
                'rating'     => 5,
                'title'      => 'شامپو فوق‌العاده',
                'body'       => 'بعد از دو هفته استفاده ریزش موهام خیلی کم شد. عالیه!',
                'status'     => 'approved',
                'parent_id'=> null,
            ],

            // نظرات در انتظار تایید
            [
                'user_id'    => 3,
                'product_id' => 4,
                'rating'     => 3,
                'title'      => 'متوسط',
                'body'       => 0 ,
                'status'     => 'pending',
                'parent_id'=> null,
            ],
            [
                'user_id'    => 4,
                'product_id' => 11,
                'rating'     => 4,
                'title'      => 'ماسک مو خوب',
                'body'       => 'موهام بعد از استفاده خیلی نرم و براق شد.',
                'status'     => 'pending',
                'parent_id'=> null,
            ],

            // نظر رد شده
            [
                'user_id'    => 9,
                'product_id' => 3,
                'rating'     => 1,
                'title'      => 'بد بود',
                'body'       => 'اصلاً راضی نبودم، پس گرفتم.',
                'status'     => 'rejected',
                'parent_id'=> null,
            ],
        ];

        foreach ($comments as $comment) {
            Comment::create($comment);
        }

        $this->command->info('✅ Comments seeded: 6 approved + 2 pending + 1 rejected');
    }
}
