<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Storage;

class CategoryController extends Controller
{
      public function index(Request $request)
    {
        $query = Category::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->id) {
            $query->where('id', $request->id);
        }

        $category = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($category);
    }

    public function store(Request $request)
    {
        $validate_data=$request->validate([
            'name'           => 'required|string|max:255',
            'meta_title'    => 'required|string|max:255|unique:categories',
            'meta_desc'    => 'required|string|max:255|unique:categories',
            'slug'    => 'required|string|max:255|unique:categories',
            'description'    => 'nullable|string',
            'image'          => 'nullable|image|max:2048',
            'parent_id'    => 'required|integer|exists:categories',
            'is_active'   => 'required|in:0,1',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $category = Category::create($validate_data);

        return response()->json(['message' => 'دسته بندی با موفقیت ایجاد شد!', 'category' => $category], 201);
    }

    public function update(Request $request, $id)
    {
        $validate_data=$request->validate([
            'name'           => 'required|string|max:255',
            'meta_title'    => 'required|string|max:255|unique:categories,meta_title,' . $id,
            'meta_desc'    => 'required|string|max:255|unique:categories,meta_desc,' . $id,
            'slug'    => 'required|string|max:255|unique:categories,slug,' . $id,
            'description'    => 'nullable|string',
            'image'          => 'nullable|image|max:2048',
            'parent_id'    => 'required|integer|exists:categories',
            'is_active'   => 'required|in:0,1',
        ]);

        $category = Category::findOrFail($id);
       if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $imagePath = $request->file('image')->store('products', 'public');
            $category->image = $imagePath;
        }

        $category = $category->update($validate_data);

        return response()->json(['message' => 'دسته بندی با موفقیت بروز شد!', 'category' => $category], 201);



    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();
        return response()->json(['message' => 'دسته‌بندی با موفقیت حذف شد']);
    }

}
