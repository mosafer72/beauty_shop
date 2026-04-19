<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user:id,name,phone', 'items.product']);

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->is_new) {
            $query->where('is_new', true);
        }

        if ($request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('user', function ($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('phone', 'like', '%' . $request->search . '%');
                  });
        }

        $orders = $query->orderByRaw('is_new DESC, created_at DESC')->paginate(15);

        $newOrdersCount = Order::where('is_new', true)->count();

        return response()->json([
            'orders'          => $orders,
            'new_orders_count' => $newOrdersCount,
        ]);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);
        $order->update(['is_new' => false]);
        return response()->json($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'status' => $request->status,
            'is_new' => false,
        ]);

        return response()->json(['message' => 'وضعیت سفارش بروز شد', 'order' => $order]);
    }
}
