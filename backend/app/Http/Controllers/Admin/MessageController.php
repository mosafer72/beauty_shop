<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $messages = Message::with(['fromUser:id,name', 'toUser:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($messages);
    }

    public function send(Request $request)
    {
        $request->validate([
            'subject'      => 'nullable|string|max:255',
            'body'         => 'required|string',
            'to_user_id'   => 'nullable|exists:users,id',
            'is_broadcast' => 'boolean',
        ]);

        if ($request->is_broadcast) {
            // ارسال به همه
            $users = User::where('role', 'user')->where('is_active', true)->get();
            foreach ($users as $user) {
                Message::create([
                    'from_user_id' => $request->user()->id,
                    'to_user_id'   => $user->id,
                    'subject'      => $request->subject,
                    'body'         => $request->body,
                    'is_broadcast' => true,
                ]);
            }
            return response()->json(['message' => 'پیام به همه کاربران ارسال شد']);
        }

        $request->validate(['to_user_id' => 'required|exists:users,id']);

        Message::create([
            'from_user_id' => $request->user()->id,
            'to_user_id'   => $request->to_user_id,
            'subject'      => $request->subject,
            'body'         => $request->body,
            'is_broadcast' => false,
        ]);

        return response()->json(['message' => 'پیام ارسال شد']);
    }

    // دریافت پیام‌های کاربر لاگین شده
    public function userMessages(Request $request)
    {
        $messages = Message::where('to_user_id', $request->user()->id)
            ->with('fromUser:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages);
    }

    public function markRead(Request $request, $id)
    {
        Message::where('id', $id)
            ->where('to_user_id', $request->user()->id)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'پیام خوانده شد']);
    }
}
