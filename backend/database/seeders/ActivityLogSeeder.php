<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityLog;

class ActivityLogSeeder extends Seeder
{
    public function run(): void
    {
        $logs = [
            ['user_id' => 3,  'action' => 'login',           'url' => '/api/auth/login',              'ip_address' => '192.168.1.10', 'method' => 'POST', 'status_code' => 200, 'created_at' => now()->subDays(5)],
            ['user_id' => 3,  'action' => 'view_products',   'url' => '/api/products',                'ip_address' => '192.168.1.10', 'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subDays(5)],
            ['user_id' => 3,  'action' => 'view_product',    'url' => '/api/products/1',              'ip_address' => '192.168.1.10', 'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subDays(5)],
            ['user_id' => 3,  'action' => 'add_to_cart',     'url' => '/api/cart',                    'ip_address' => '192.168.1.10', 'method' => 'POST', 'status_code' => 201, 'created_at' => now()->subDays(5)],
            ['user_id' => 3,  'action' => 'checkout',        'url' => '/api/orders',                  'ip_address' => '192.168.1.10', 'method' => 'POST', 'status_code' => 201, 'created_at' => now()->subDays(5)],
            ['user_id' => 4,  'action' => 'login',           'url' => '/api/auth/login',              'ip_address' => '10.0.0.5',     'method' => 'POST', 'status_code' => 200, 'created_at' => now()->subDays(3)],
            ['user_id' => 4,  'action' => 'view_products',   'url' => '/api/products?category=2',     'ip_address' => '10.0.0.5',     'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subDays(3)],
            ['user_id' => 4,  'action' => 'place_order',     'url' => '/api/orders',                  'ip_address' => '10.0.0.5',     'method' => 'POST', 'status_code' => 201, 'created_at' => now()->subDays(2)],
            ['user_id' => 5,  'action' => 'login',           'url' => '/api/auth/login',              'ip_address' => '172.16.0.8',   'method' => 'POST', 'status_code' => 200, 'created_at' => now()->subDays(1)],
            ['user_id' => 5,  'action' => 'view_product',    'url' => '/api/products/5',              'ip_address' => '172.16.0.8',   'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subDays(1)],
            ['user_id' => 1,  'action' => 'admin_login',     'url' => '/api/admin/login',             'ip_address' => '127.0.0.1',    'method' => 'POST', 'status_code' => 200, 'created_at' => now()->subHours(8)],
            ['user_id' => 1,  'action' => 'view_orders',     'url' => '/api/admin/orders',            'ip_address' => '127.0.0.1',    'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subHours(7)],
            ['user_id' => 1,  'action' => 'update_order',    'url' => '/api/admin/orders/1',          'ip_address' => '127.0.0.1',    'method' => 'PUT',  'status_code' => 200, 'created_at' => now()->subHours(6)],
            ['user_id' => 8,  'action' => 'login',           'url' => '/api/auth/login',              'ip_address' => '192.168.2.20', 'method' => 'POST', 'status_code' => 200, 'created_at' => now()->subHours(4)],
            ['user_id' => 8,  'action' => 'add_comment',     'url' => '/api/products/7/comments',     'ip_address' => '192.168.2.20', 'method' => 'POST', 'status_code' => 201, 'created_at' => now()->subHours(3)],
            ['user_id' => null,'action' => 'failed_login',   'url' => '/api/auth/login',              'ip_address' => '85.204.36.12', 'method' => 'POST', 'status_code' => 401, 'created_at' => now()->subHours(2)],
            ['user_id' => null,'action' => 'failed_login',   'url' => '/api/auth/login',              'ip_address' => '85.204.36.12', 'method' => 'POST', 'status_code' => 401, 'created_at' => now()->subHours(2)],
            ['user_id' => null,'action' => 'failed_login',   'url' => '/api/auth/login',              'ip_address' => '85.204.36.12', 'method' => 'POST', 'status_code' => 401, 'created_at' => now()->subHours(1)],
            ['user_id' => 3,  'action' => 'view_profile',    'url' => '/api/user/profile',            'ip_address' => '192.168.1.10', 'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subMinutes(30)],
            ['user_id' => 4,  'action' => 'view_orders',     'url' => '/api/user/orders',             'ip_address' => '10.0.0.5',     'method' => 'GET',  'status_code' => 200, 'created_at' => now()->subMinutes(15)],
        ];

        foreach ($logs as $log) {
            ActivityLog::create($log);
        }

        $this->command->info('✅ Activity logs seeded: 20 logs');
    }
}
