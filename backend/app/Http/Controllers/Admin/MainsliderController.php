<?

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MainSlider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MainsliderController extends Controller
{
    /**
     * نمایش لیست اسلایدرها.
     * مرتب‌سازی بر اساس فیلد 'order'.
     */
    public function index()
    {
        $sliders = MainSlider::orderBy('order', 'asc')->get();

        return response()->json($sliders);
    }

    /**
     * ایجاد اسلایدر جدید.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048', // عکس اجباری است
            'link' => 'required|url|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // آپلود عکس
        $imagePath = $request->file('image')->store('sliders', 'public');
        $validated['image'] = $imagePath;

        // اگر order ارسال نشده، آخرین order + 1
        if (!isset($validated['order'])) {
            $lastOrder = MainSlider::orderBy('order', 'desc')->first()->order ?? -1;
            $validated['order'] = $lastOrder + 1;
        }

        $slider = MainSlider::create($validated);

        return response()->json([
            'message' => 'اسلایدر ایجاد شد.',
            'data' => $slider
        ], 201);
    }

    /**
     * نمایش اطلاعات یک اسلایدر خاص.
     */
    public function show(MainSlider $slider) // Route Model Binding
    {
        return response()->json($slider);
    }

    /**
     * به‌روزرسانی یک اسلایدر.
     */
    public function update(Request $request, MainSlider $slider)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // عکس اختیاری برای آپدیت
            'link' => 'nullable|url|max:255',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        // آپلود عکس جدید اگر ارسال شده
        if ($request->hasFile('image')) {
            // حذف عکس قبلی
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        }

        // به‌روزرسانی اطلاعات
        $slider->update($validated);

        return response()->json([
            'message' => 'اسلایدر بروز شد.',
            'data' => $slider
        ]);
    }

    /**
     * حذف یک اسلایدر.
     */
    public function destroy(MainSlider $slider)
    {
        // حذف عکس از storage
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }

        $slider->delete(); // اگر از SoftDeletes استفاده می‌کنی

        return response()->json(['message' => 'اسلایدر حذف شد!']);
    }

    /**
     * دریافت اسلایدرهای فعال برای نمایش در صفحه اصلی
     */
    public function getActiveSliders()
    {
        $sliders = MainSlider::where('is_active', true)
                        ->orderBy('order', 'asc')
                        ->get();

        return response()->json($sliders);
    }
}

