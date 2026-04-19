<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserActive
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && !$request->user()->is_active) {
            $request->user()->tokens()->delete();
            return response()->json(['message' => 'حساب کاربری شما غیرفعال شده است'], 403);
        }
        return $next($request);
    }
}
