<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user:id,name,phone');

        if ($request->ip) {
            $query->where('ip_address', 'like', '%' . $request->ip . '%');
        }

        if ($request->url) {
            $query->where('url', 'like', '%' . $request->url . '%');
        }

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($logs);
    }
}
