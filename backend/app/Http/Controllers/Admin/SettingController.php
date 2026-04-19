<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    // دریافت تنظیمات برای پنل ادمین
    public function index()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

    // ذخیره یا آپدیت تنظیمات
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'usd_price' => 'nullable|numeric',
            'socials' => 'nullable|array',
            'phone' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:500',
            'about_us' => 'nullable|string',
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $validated = $validator->validated();

        // گرفتن اولین رکورد یا ساخت آن
        $settings = Setting::first();
        if (!$settings) {
            $settings = Setting::create($validated);
        } else {
            $settings->update($validated);
        }

        return response()->json([
            'message' => 'Settings updated successfully.',
            'data' => $settings
        ]);
    }
}
