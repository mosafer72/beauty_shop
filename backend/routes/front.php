<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductPageController;
use App\Http\Controllers\RatingController;
Route::prefix('front')->group(function () {
    Route::get('/home', [HomeController::class, 'home']);
    // Route::get('/products/{id}/{slug}', [ProductPageController::class, 'show']);
    Route::get('/products/{slug}', action: [ProductController::class, 'show']);
    Route::get('/products', action: [ProductController::class, 'index']);
    Route::post('/products/{product}/rate', [RatingController::class, 'rate']);

    // Route::get('/cart', [CartController::class, 'index']);
    // Route::post('/cart/items', [CartController::class, 'addItem']);
    // Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    // Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    // Route::delete('/cart', [CartController::class, 'clear']);


    // Orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/checkout', [OrderController::class, 'checkout']);

    // Comments
    Route::post('/comments', [CommentController::class, 'store']);

    // Messages
    // Route::get('/messages', [Admin\MessageController::class, 'userMessages']);
    // Route::put('/messages/{id}/read', [Admin\MessageController::class, 'markRead']);

    Route::middleware('auth:sanctum')->group(function () {

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::put('/cart/update/{id}', [CartController::class, 'update']);
    Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
        Route::post('/checkout', [PaymentController::class, 'checkout']);
    });

    Route::get('/verify/zarinpal', [PaymentController::class, 'verifyZarinpal'])->name('zarinpal.verify');
    Route::get('/verify/idpay', [PaymentController::class, 'verifyIdPay'])->name('idpay.verify');
});
