<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductPageController extends Controller
{
    public function show($id, $slug)
    {
        $product = Product::with([
            'brand',
            'comments.replies'
        ])->where('id', $id)
          ->where('slug', $slug)
          ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'product' => $product,
            'comments' => $product->comments
        ]);
    }
}
