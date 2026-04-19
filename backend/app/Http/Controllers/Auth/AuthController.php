<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{
    // ارسال OTP
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|regex:/^09[0-9]{9}$/',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $otp = rand(10000, 99999);

        $user = User::firstOrCreate(
            ['phone' => $request->phone],
            ['name' => 'کاربر ' . $request->phone, 'password' => Hash::make(uniqid())]
        );

        $user->update([
            'otp_code'       => Hash::make($otp),
            'otp_expires_at' => Carbon::now()->addMinutes(5),
        ]);

        // در محیط واقعی از SMS gateway استفاده کنید
        // SmsService::send($request->phone, "کد تایید: $otp");

        return response()->json([
            'message' => 'کد تایید ارسال شد',
            'otp'     => $otp, // فقط در محیط development
        ]);
    }

    // تایید OTP و ورود/ثبت‌نام
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'required|regex:/^09[0-9]{9}$/',
            'otp'   => 'required|digits:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json(['message' => 'کاربر یافت نشد'], 404);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'حساب کاربری شما غیرفعال است'], 403);
        }

        if (!$user->otp_expires_at || Carbon::now()->gt($user->otp_expires_at)) {
            return response()->json(['message' => 'کد تایید منقضی شده است'], 422);
        }

        if (!Hash::check($request->otp, $user->otp_code)) {
            return response()->json(['message' => 'کد تایید اشتباه است'], 422);
        }

        $user->update(['otp_code' => null, 'otp_expires_at' => null]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'ورود موفق',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    // ادمین - لاگین با رمز
    public function adminLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone'    => 'required',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('phone', $request->phone)->where('role', 'admin')->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'اطلاعات ورود اشتباه است'], 401);
        }

        $token = $user->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'ورود موفق',
            'token'   => $token,
            'user'    => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'خروج موفق']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('messages'));
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $request->user()->update(['name' => $request->name]);

        return response()->json(['message' => 'پروفایل بروز شد', 'user' => $request->user()]);
    }
}
