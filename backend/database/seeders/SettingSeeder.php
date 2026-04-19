<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::create([
            'usd_price' => 60000,
            'socials' => [
                'instagram' => 'https://instagram.com/yourshop',
                'telegram' => 'https://t.me/yourshop',
                'whatsapp' => 'https://wa.me/09xxxxxxxxx'
            ],
            'phone' => '021-12345678',
            'mobile' => '09120000000',
            'address' => 'تهران، خیابان مثال، پلاک 12',
            'about_us' => 'فروشگاه ما ارائه دهنده بهترین لوازم آرایشی و مراقبتی است.',
        ]);
    }
}
