<?php

<<<<<<< HEAD
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\MainsliderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Admin;
=======
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Api\FinancialDataController;
use App\Http\Controllers\Api\FlashcardAnswerController;
use App\Http\Controllers\Api\FlashcardController;
use App\Http\Controllers\Api\SimpleBackupController;
use App\Http\Controllers\Api\StatsReportController;
use App\Http\Controllers\Api\SyncController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


// Auth
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/admin-login', [AuthController::class, 'adminLogin']);

<<<<<<< HEAD
// Public
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'categories']);
=======

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'username' => $request->user()->username,
    ]);
});

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/auth/user', [AuthController::class, 'user']);

});

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/stats', [UserController::class, 'getStats']);
Route::get('/transactions', [TransactionController::class, 'index']);
Route::get('/transactions/stats', [TransactionController::class, 'getStats']);
Route::get('/sync/start', [SyncController::class, 'start']);
Route::get('/sync/progress/{id}', [SyncController::class, 'progress']);
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5

// // Authenticated User
// Route::middleware(['auth:sanctum', 'check.active'])->group(function () {
//     Route::post('/auth/logout', [AuthController::class, 'logout']);
//     Route::get('/auth/me', [AuthController::class, 'me']);
//     Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

//     // Cart
//     Route::get('/cart', [CartController::class, 'index']);
//     Route::post('/cart/items', [CartController::class, 'addItem']);
//     Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
//     Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
//     Route::delete('/cart', [CartController::class, 'clear']);

<<<<<<< HEAD
//     // Orders
//     Route::get('/orders', [OrderController::class, 'index']);
//     Route::get('/orders/{id}', [OrderController::class, 'show']);
//     Route::post('/checkout', [OrderController::class, 'checkout']);
=======
Route::prefix('backup')->group(function () {
    Route::post('/upload', [SimpleBackupController::class, 'uploadBackup']);
    Route::get('/list', [SimpleBackupController::class, 'listBackups']);
    Route::get('/sync', [SimpleBackupController::class, 'downloadFromUrl']);
    Route::get('/restore/{file}', [SimpleBackupController::class,'restoreBackup']);
    Route::get('/listBackupFiles', [SimpleBackupController::class,'listBackupFiles']);

});
>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5

//     // Comments

//     // Messages
//     Route::get('/messages', [Admin\MessageController::class, 'userMessages']);
//     Route::put('/messages/{id}/read', [Admin\MessageController::class, 'markRead']);
// });

<<<<<<< HEAD
// Admin Routes
// Route::middleware(['auth:sanctum', 'admin', 'check.active'])->prefix('admin')->group(function () {
Route::prefix('admin')->group(function () {
=======
Route::prefix('flashcards')->group(function () {
    Route::get('/', [App\Http\Controllers\Admin\FlashcardController::class, 'index']);
    Route::post('/', [App\Http\Controllers\Admin\FlashcardController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\Admin\FlashcardController::class, 'show']);
    Route::put('/{id}', [App\Http\Controllers\Admin\FlashcardController::class, 'update']);
    Route::delete('/{id}', [App\Http\Controllers\Admin\FlashcardController::class, 'destroy']);
});
Route::prefix('admin')->group(
    function () {
        Route::get('/courses', [App\Http\Controllers\Admin\CourseController::class, 'index']);
        Route::post('/courses', [App\Http\Controllers\Admin\CourseController::class, 'store']);
        Route::delete('/courses/{id}', [App\Http\Controllers\Admin\CourseController::class, 'destroy']);
        Route::get('/courses/{course}/lessons', [App\Http\Controllers\Admin\LessonController::class, 'index']);
        Route::post('/lessons', [App\Http\Controllers\Admin\LessonController::class, 'store']);
        Route::delete('/lessons/{id}', [App\Http\Controllers\Admin\LessonController::class, 'destroy']);
    }
);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}/lessons', [CourseController::class, 'lessons']);
Route::get('/lessons/{lesson}/flashcards', [FlashcardController::class, 'getFlashcard']);




// Route::get('/flashcard', [FlashcardController::class, 'getFlashcard']);
Route::post('/check-answer', [FlashcardController::class, 'checkAnswer']);
Route::post('/flashcard/answer', [FlashcardAnswerController::class, 'answer']);
Route::get('/flashcard/{flashcard}/answers', [FlashcardAnswerController::class, 'history']);


>>>>>>> c3315e64524d87686976a3eeebfc315510a7d0c5


    // Users
    Route::get('/users', [Admin\UserController::class, 'index']);
    Route::post('/users', [Admin\UserController::class, 'store']);
    Route::post('/users/{user}', [Admin\UserController::class, 'update']);
    Route::get('/users/{id}', [Admin\UserController::class, 'show']);
    Route::put('/users/{id}/toggle-active', [Admin\UserController::class, 'toggleActive']);
    Route::post('/users/{id}/login-as', [Admin\UserController::class, 'loginAsUser']);

    // Products
    Route::get('/products', [Admin\ProductController::class, 'index']);
    Route::post('/products', [Admin\ProductController::class, 'store']);
    Route::put('/products/{id}', [Admin\ProductController::class, 'update']);
    Route::put('/products/{id}/stock', [Admin\ProductController::class, 'updateStock']);
    Route::delete('/products/{id}', [Admin\ProductController::class, 'destroy']);

    //categories

    Route::get('/categories', [Admin\CategoryController::class, 'index']);
    Route::post('/categories', [Admin\CategoryController::class, 'store']);
    Route::put('/categories/{id}', [Admin\CategoryController::class, 'update']);
    Route::put('/categories/{id}/stock', [Admin\CategoryController::class, 'updateStock']);
    Route::delete('/categories/{id}', [Admin\CategoryController::class, 'destroy']);

    // Orders
    Route::get('/orders', [Admin\OrderController::class, 'index']);
    Route::get('/orders/{id}', [Admin\OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [Admin\OrderController::class, 'updateStatus']);

    // Comments
    Route::get('/comments', [Admin\CommentController::class, 'index']);
    Route::put('/comments/{id}/status', [Admin\CommentController::class, 'updateStatus']);
    Route::post('/comments/{id}/reply', [Admin\CommentController::class, 'reply']);

    // Messages
    Route::get('/messages', [Admin\MessageController::class, 'index']);
    Route::post('/messages', [Admin\MessageController::class, 'send']);

    Route::prefix('brands')->group(function () {
        Route::get('/', [BrandController::class, 'index']);
        Route::post('/', [BrandController::class, 'store']);
        Route::get('/{brand}', [BrandController::class, 'show']);
        Route::put('/{brand}', [BrandController::class, 'update']);
        Route::delete('/{brand}', [BrandController::class, 'destroy']);
    });

    //sliders

    Route::get('/sliders/', [MainsliderController::class, 'index']); // لیست همه (برای پنل ادمین)
    Route::post('/sliders/', [MainsliderController::class, 'store']); // ایجاد جدید
    Route::get('/sliders/sliders{slider}', [MainsliderController::class, 'show']); // نمایش جزئیات
    Route::put('/sliders/{slider}', [MainsliderController::class, 'update']); // به‌روزرسانی
    Route::delete('/sliders/{slider}', [MainsliderController::class, 'destroy']); // حذف


    // Logs
    Route::get('/logs', [Admin\LogController::class, 'index']);
});

Route::prefix('admin/settings')->group(function () {
    Route::get('/', [SettingController::class, 'index']);
    Route::post('/update', [SettingController::class, 'update']);
});


require_once "front.php";
