<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rating;
use App\Models\User;
use App\Models\Product;

class RatingSeeder extends Seeder
{
    public function run(): void
    {
        // اگر محصول وجود نداشت، هیچ کاری نکن
        $product = Product::find(1);

        if (!$product) {
            echo "Product with ID 1 not found.\n";
            return;
        }

        // ساخت چند کاربر تست اگر وجود ندارند
        $users = User::take(5)->get();

        // اگر کاربری نبود، چند کاربر تست بساز
        // if ($users->count() < 5) {
        //     $users = User::factory()->count(5)->create();
        // }

        $ratings = [5, 4, 3, 5, 4]; // امتیازهای نمونه

        foreach ($users as $index => $user) {
            Rating::updateOrCreate([
                'user_id' => $user->id,
                'product_id' => $product->id,
            ], [
                'rating' => $ratings[$index] ?? 4
            ]);
        }

        echo "Ratings seeded for product ID 1.\n";
    }
}
