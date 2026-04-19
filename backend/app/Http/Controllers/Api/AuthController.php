<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{

    // login
    public function login(Request $request)
    {

        $request->validate([

            'username' => 'required',
            'password' => 'required',

        ]);

        $user = User::where('username', $request->username)
        ->orWhere('email', $request->username)
        ->orWhere('mobile', $request->username)
        ->first();

        // if (!$user || !Hash::check($request->password, $user->password)) {
        if (!$user) {

            return response()->json([

                'success' => false,
                'message' => 'اطلاعات ورود اشتباه است'

            ], 401);
        }

        Auth::login($user);

        return response()->json([

            'success' => true,
            'user' => $user

        ]);
    }


    // logout
    public function logout(Request $request)
    {

        Auth::logout();

        return response()->json([

            'success' => true

        ]);
    }



    // get user
    public function user(Request $request)
    {

        return response()->json([

            'success' => true,

            'user' => $request->user()

        ]);
    }


}
