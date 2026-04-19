<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MainSlider;
use App\Models\Product;
use App\Models\Setting;
use App\Models\Slider;
use App\Models\Brand;

class HomeController extends Controller
{
    public function home()
    {
        // 1) ده محصول جدید
        $newProducts = Product::orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // 2) ده محصول دارای تخفیف (price_after_discount یا discount_price)
        $discountedProducts = Product::whereNotNull('discount_price')
            ->where('discount_price', '>', 0)
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        // 3) اسلایدرهای فعال
        $sliders = MainSlider::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();
       // دسته بندی ها
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        // 4) لیست برندها
        $brands = Brand::orderBy('name', 'asc')->get();

        // 5) اسلایدر پرفروش‌ترین‌ها (۱۰ محصول با بیشترین فروش)
        $bestSellingSliders = Product::orderBy('sales_count', 'desc')
            ->limit(10)
            ->get();

         $settings = Setting::first();

        return response()->json([
            'status' => true,
            'data' => [
                'new_products' => $newProducts,
                'discounted_products' => $discountedProducts,
                'sliders' => $sliders,
                'brands' => $brands,
                'best_selling_sliders' => $bestSellingSliders,
                'categories' => $categories,
                'settings' => $settings,
            ]
        ]);
    }
}
