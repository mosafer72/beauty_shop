<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    // لیست همه برندها (برای پنل)
    public function index()
    {
        $brands = Brand::orderBy('order', 'asc')->get();
        return response()->json($brands);
    }

    // ایجاد برند جدید
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255|unique:brands,name',
            'description' => 'nullable|string',
            'logo'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active'   => 'nullable|boolean',
            'order'       => 'nullable|integer|min:0',
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $validated = $validator->validated();
        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('brands', 'public');
        }

        // ترتیب
        if (!isset($validated['order'])) {
            $lastOrder = Brand::orderBy('order', 'desc')->first()->order ?? -1;
            $validated['order'] = $lastOrder + 1;
        }

        $brand = Brand::create($validated);
        return response()->json([
            'message' => 'برند ایجاد شد.',
            'data' => $brand
        ], 201);
    }

    // نمایش جزئیات برند
    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    // ویرایش برند
    public function update(Request $request, Brand $brand)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'nullable|string|max:255|unique:brands,name,' . $brand->id,
            'description' => 'nullable|string',
            'logo'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active'   => 'nullable|boolean',
            'order'       => 'nullable|integer|min:0',
        ]);

        if ($validator->fails())
            return response()->json(['errors' => $validator->errors()], 422);

        $validated = $validator->validated();

        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // آپلود لوگو جدید
        if ($request->hasFile('logo')) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $validated['logo'] = $request->file('logo')->store('brands', 'public');
        }

        $brand->update($validated);

        return response()->json([
            'message' => 'برند بروز شد.',
            'data' => $brand
        ]);
    }

    // حذف برند
    public function destroy(Brand $brand)
    {
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();
        return response()->json(['message' => 'برند حذف شد']);
    }

    // لیست برندهای فعال برای صفحه اصلی
    public function getActiveBrands()
    {
        $brands = Brand::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();

        return response()->json($brands);
    }
}
