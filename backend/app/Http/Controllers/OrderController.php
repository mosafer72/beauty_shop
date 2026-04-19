<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'address' => 'required|string|max:500',
            'phone'   => 'required|regex:/^09[0-9]{9}$/',
        ]);

        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'سبد خرید خالی است'], 422);
        }

        DB::beginTransaction();
        try {
            $total = 0;
            foreach ($cart->items as $item) {
                if ($item->product->stock < $item->quantity) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "موجودی {$item->product->name} کافی نیست"
                    ], 422);
                }
                $total += $item->quantity * ($item->product->discount_price ?? $item->product->price);
            }

            $order = Order::create([
                'user_id'      => $request->user()->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'total_price'  => $total,
                'status'       => 'pending',
                'address'      => $request->address,
                'phone'        => $request->phone,
                'notes'        => $request->notes,
                'is_new'       => true,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->discount_price ?? $item->product->price,
                ]);
                $item->product->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'سفارش ثبت شد',
                'order'   => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'خطا در ثبت سفارش'], 500);
        }
    }
}
