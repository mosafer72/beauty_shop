<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ادمین اصلی
        User::create([
            'name'        => 'مدیر سیستم',
            'phone'      => '09120000000',
            'password'    => Hash::make('Admin@12345'),
            'role'        => 'admin',
            'is_active'   => true,
            'gender'      => '1',
        ]);

        // ادمین دوم
        User::create([
            'name'        => 'پشتیبانی',
            'phone'      => '09120000001',
            'password'    => Hash::make('Support@123'),
            'role'        => 'admin',
            'is_active'   => true,
            'gender'      => '0',
        ]);

        // کاربران عادی
        $users = [
            [
                'name'       => 'سارا احمدی',
                'phone'     => '09121111111',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '0',
            ],
            [
                'name'       => 'مریم محمدی',
                'phone'     => '09122222222',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '0',
            ],
            [
                'name'       => 'زهرا کریمی',
                'phone'     => '09123333333',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '0',
            ],
            [
                'name'       => 'فاطمه رضایی',
                'phone'     => '09124444444',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '0',
            ],
            [
                'name'       => 'نیلوفر حسینی',
                'phone'     => '09125555555',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => false, // کاربر غیرفعال برای تست
                'gender'     => '0',
            ],
            [
                'name'       => 'علی نجفی',
                'phone'     => '09126666666',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '1',
            ],
            [
                'name'       => 'رضا موسوی',
                'phone'     => '09127777777',
                'password'   => Hash::make('User@1234'),
                'role'       => 'user',
                'is_active'  => true,
                'gender'     => '1',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }

        $this->command->info('✅ Users seeded: 2 admin + 7 users');
    }
}
