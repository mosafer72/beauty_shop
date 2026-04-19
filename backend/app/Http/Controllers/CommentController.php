<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'body'       => 'required|string|max:1000',
            'rating'     => 'nullable|integer|min:1|max:5',
        ]);

        $comment = Comment::create([
            'user_id'    => $request->user()->id,
            'product_id' => $request->product_id,
            'body'       => $request->body,
            'rating'     => $request->rating,
            'status'     => 'pending',
        ]);

        return response()->json([
            'message' => 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود',
            'comment' => $comment,
        ], 201);
    }
}
