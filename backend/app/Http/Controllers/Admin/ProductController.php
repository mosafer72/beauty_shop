<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Faker\Provider\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->low_stock) {
            $query->where('stock', '<=', 10);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $valid_data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'slug' => 'required|string|unique:products,slug',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'stock' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean'
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($valid_data);

        return response()->json(['message' => 'محصول ایجاد شد', 'product' => $product], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $valid_data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:products,slug,' . $product->id,
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'stock' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $product->image = $imagePath;
        }

        $product->update($valid_data);

        return response()->json(['message' => 'محصول بروز شد', 'product' => $product]);
    }

    public function updateStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:0',
            'action' => 'required|in:set,add,subtract',
        ]);

        $product = Product::findOrFail($id);

        switch ($request->action) {
            case 'set':
                $product->update(['stock' => $request->stock]);
                break;
            case 'add':
                $product->increment('stock', $request->stock);
                break;
            case 'subtract':
                if ($product->stock < $request->stock) {
                    return response()->json(['message' => 'موجودی کافی نیست'], 422);
                }
                $product->decrement('stock', $request->stock);
                break;
        }

        return response()->json([
            'message' => 'موجودی بروز شد',
            'product' => $product->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }
        $product->delete();
        return response()->json(['message' => 'محصول حذف شد']);
    }

    // مدیریت دسته‌بندی‌ها
    public function categories()
    {
        return response()->json(Category::all());
    }

    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(4),
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json(['message' => 'دسته‌بندی ایجاد شد', 'category' => $category], 201);
    }
}
