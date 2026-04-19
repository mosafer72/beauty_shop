<?php

namespace App\Http\Middleware;

use App\Models\ActivityLog;
use Closure;
use Illuminate\Http\Request;

class LogActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        ActivityLog::create([
            'user_id'    => $request->user()?->id,
            'ip_address' => $request->ip(),
            'url'        => $request->fullUrl(),
            'method'     => $request->method(),
            'user_agent' => $request->userAgent(),
            'payload'    => $request->except(['password', 'otp_code']),
        ]);

        return $response;
    }
}
