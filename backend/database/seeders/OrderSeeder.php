<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $orders = [
            // سفارش تحویل داده شده
            [
                'order' => [
                    'user_id'          => 3, // سارا
                    'order_number'     => 'ORD-' . date('Ymd') . '-0001',
                    'status'           => 'delivered',
                    'total_price'      => 357000,
                    'discount_amount'  => 0,
                    'final_price'      => 357000,
                    'payment_status'   => 'paid',
                ],
                'items' => [
                    ['product_id' => 1, 'quantity' => 2, 'price' => 72000],
                    ['product_id' => 7, 'quantity' => 2, 'price' => 105000],
                ],
            ],

            // سفارش در حال پردازش
            [
                'order' => [
                    'user_id'          => 3, // سارا
                    'order_number'     => 'ORD-' . date('Ymd') . '-0002',
                    'status'           => 'processing',
                    'total_price'      => 320000,
                    'discount_amount'  => 0,
                    'final_price'      => 320000,
                    'payment_status'   => 'paid',
                    'notes'            => null,
                ],
                'items' => [
                    ['product_id' => 2, 'quantity' => 1, 'price' => 320000],
                ],
            ],

            // سفارش جدید (برای تست رنگ قرمز در پنل ادمین)
            [
                'order' => [
                    'user_id'          => 4, // مریم
                    'order_number'     => 'ORD-' . date('Ymd') . '-0003',
                    'status'           => 'pending',
                    'total_price'      => 465000,
                    'discount_amount'  => 25000,
                    'final_price'      => 440000,
                    'payment_status'   => 'paid',
                    'notes'            => 'تا فردا نیاز دارم',
                ],
                'items' => [
                    ['product_id' => 5, 'quantity' => 1, 'price' => 185000],
                    ['product_id' => 4, 'quantity' => 1, 'price' => 240000],
                ],
            ],

            // سفارش جدید دیگر
            [
                'order' => [
                    'user_id'          => 5, // زهرا
                    'order_number'     => 'ORD-' . date('Ymd') . '-0004',
                    'status'           => 'pending',
                    'total_price'      => 185000,
                    'discount_amount'  => 0,
                    'final_price'      => 185000,
                    'payment_status'   => 'pending',
                    'notes'            => null,
                ],
                'items' => [
                    ['product_id' => 5, 'quantity' => 1, 'price' => 185000],
                ],
            ],

            // سفارش ارسال شده
            [
                'order' => [
                    'user_id'          => 6, // فاطمه
                    'order_number'     => 'ORD-' . date('Ymd') . '-0005',
                    'status'           => 'shipped',
                    'total_price'      => 2100000,
                    'discount_amount'  => 200000,
                    'final_price'      => 1900000,
                    'payment_status'   => 'paid',
                    'notes'            => null,
                ],
                'items' => [
                    ['product_id' => 12, 'quantity' => 1, 'price' => 1900000],
                ],
            ],

            // سفارش لغو شده
            [
                'order' => [
                    'user_id'          => 8, // علی
                    'order_number'     => 'ORD-' . date('Ymd') . '-0006',
                    'status'           => 'cancelled',
                    'total_price'      => 125000,
                    'discount_amount'  => 0,
                    'final_price'      => 125000,
                    'payment_status'   => 'refunded',
                    'notes'            => 'انصراف دادم',
                ],
                'items' => [
                    ['product_id' => 7, 'quantity' => 1, 'price' => 125000],
                ],
            ],
        ];

        foreach ($orders as $orderData) {
            $order = Order::create($orderData['order']);

            foreach ($orderData['items'] as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity'   => $item['quantity'],
                    'price'      => $item['price'],
                    'total'      => $item['price'] * $item['quantity'],
                ]);
            }
        }

        $this->command->info('✅ Orders seeded: 6 orders with items');
    }
}
