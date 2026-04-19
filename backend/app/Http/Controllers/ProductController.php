<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category')
            ->where('is_active', true);

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->category_slug) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category_slug);
            });
        }

        $products = $query->orderBy('created_at', 'desc')
                          ->paginate($request->per_page ?? 12);

        return response()->json($products);
    }


    public function show($slug)
    {
        $product = Product::withAvg('ratings','rating')->withCount('ratings')->with(['category', 'comments' => function ($q) {
            $q->with(['user:id,name', 'replies.user:id,name'])
              ->whereNull('parent_id')
              ->where('status', 'approved');
        }])->where('slug', $slug)->where('is_active', true)->firstOrFail();
        return response()->json($product);
        $product = Product::withAvg('ratings','rating')
    ->withCount('ratings')
    ->find($id);
    }

    public function categories()
    {
        $categories = Category::where('is_active', true)->get();
        return response()->json($categories);
    }
}
