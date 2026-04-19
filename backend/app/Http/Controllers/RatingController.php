<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Product;
use Illuminate\Http\Request;

class RatingController extends Controller
{

    public function rate(Request $request, $product_id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5'
        ]);

        $user = auth()->user();

        $rating = Rating::where('user_id', $user->id)
            ->where('product_id', $product_id)
            ->first();

        if ($rating) {

            return response()->json([
                'message' => 'You already rated this product'
            ], 400);

        }

        $rating = Rating::create([
            'user_id' => $user->id,
            'product_id' => $product_id,
            'rating' => $request->rating
        ]);

        return response()->json([
            'message' => 'Rating submitted',
            'data' => $rating
        ]);
    }
}
