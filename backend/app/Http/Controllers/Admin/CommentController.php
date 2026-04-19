<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $query = Comment::with(['user:id,name', 'product:id,name,slug'])
            ->whereNull('parent_id');

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $comments = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($comments);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
        ]);

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => $request->status]);

        return response()->json([
            'message' => $request->status === 'approved' ? 'نظر تایید شد' : 'نظر رد شد',
            'comment' => $comment,
        ]);
    }

    public function reply(Request $request, $id)
    {
        $request->validate(['body' => 'required|string|max:1000']);

        $comment = Comment::findOrFail($id);

        $reply = Comment::create([
            'user_id'    => $request->user()->id,
            'product_id' => $comment->product_id,
            'parent_id'  => $comment->id,
            'body'       => $request->body,
            'status'     => 'approved',
        ]);

        return response()->json([
            'message' => 'پاسخ ثبت شد',
            'reply'   => $reply->load('user:id,name'),
        ]);
    }
}
