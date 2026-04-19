<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        if ($request->has('is_active') && $request->is_active !== '') {
            $query->where('is_active', $request->is_active);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::with(['orders', 'comments'])->findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => 'required|regex:/^09[0-9]{9}$/|unique:users',
            'password' => 'required|min:8',
            'role'     => 'required|in:admin,user',
        ]);


        $user = User::create([
            'name'      => $request->name,
            'phone'     => $request->phone,
            'password'  => Hash::make($request->password),
            'role'      => $request->role,
            'is_active' => true,
        ]);

        return response()->json(['message' => 'کاربر ایجاد شد', 'user' => $user], 201);
    }

     public function update(User $user,Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'phone'    => 'required|regex:/^09[0-9]{9}$/|unique:users,phone,' . $user->id,
            'password' => 'required|min:8',
            'role'     => 'required|in:admin,user',
        ]);
        $user->update();

       $user->update([
            'name'      => $request->name,
            'phone'     => $request->phone,
            'role'      => $request->role,
            'password'      =>Hash::make($request->password),
        ]);

        return response()->json(['message' => 'کاربر با موفقیت ویرایش شد', 'user' => $user], 201);
    }


    public function toggleActive($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'نمی‌توانید حساب خود را غیرفعال کنید'], 422);
        }

        $user->update(['is_active' => !$user->is_active]);

        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_active ? 'کاربر فعال شد' : 'کاربر غیرفعال شد',
            'user'    => $user,
        ]);
    }

    // لاگین به عنوان کاربر
    public function loginAsUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $token = $user->createToken('admin_impersonate')->plainTextToken;

        return response()->json([
            'message' => 'ورود به حساب کاربر',
            'token'   => $token,
            'user'    => $user,
        ]);
    }
}
