<?

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * ایجاد سفارش جدید و هدایت به درگاه (زرین‌پال یا IDPay)
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|in:zarinpal,idpay',
            'address' => 'required|string',
            'phone' => 'required|string'
        ]);

        $user = auth()->user();

        // فرض کنید قیمت‌ها از Cart گرفته شده‌اند:
        $cart = $user->cart()->with('items.product')->firstOrFail();

        $total = 0;
        foreach ($cart->items as $item) {
            $price = $item->product->discount_price ?? $item->product->price;
            $total += $price * $item->quantity;
        }

        $discount = 0; // future logic برای کوپن و تخفیف
        $final = $total - $discount;

        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => strtoupper(Str::random(10)),
            'total_price' => $total,
            'discount_amount' => $discount,
            'final_price' => $final,
            'address' => $request->address,
            'phone' => $request->phone,
            'payment_status' => 'pending',
            'status' => 'pending',
            'payment_method' => $request->payment_method,
        ]);

        // انتقال آیتم‌های سبد به سفارش
        foreach ($cart->items as $item) {
            $order->items()->create([
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
                'total' => $item->product->discount_price ?? $item->product->price,
            ]);
        }

        // خالی کردن سبد بعد از ساخت سفارش
        $cart->items()->delete();

        // مسیر درگاه
        return $request->payment_method === 'zarinpal'
            ? $this->payWithZarinpal($order)
            : $this->payWithIdPay($order);
    }

    /**
     * پرداخت با زرین‌پال
     */
    private function payWithZarinpal(Order $order)
    {
        $response = Http::post('https://sandbox.zarinpal.com/pg/v4/payment/request.json', [
            'merchant_id' => env('ZARINPAL_MERCHANT'),
            'amount' => $order->final_price * 10, // تومان به ریال
            'callback_url' => route('zarinpal.verify'),
            'description' => 'Order #' . $order->order_number,
        ]);

        $result = $response->json();
        return $result;
        if (isset($result['data']['authority'])) {
            $authority = $result['data']['authority'];
            $order->update(['payment_authority' => $authority]);

            return response()->json([
                'payment_url' => "https://www.sandbox.zarinpal.com/pg/StartPay/{$authority}",
                'order' => $order,
            ]);
        }

        return response()->json(['error' => 'Zarinpal payment init failed'], 500);
    }

    /**
     * تأیید پرداخت زرین‌پال
     */
    public function verifyZarinpal(Request $request)
    {
        $authority = $request->Authority;
        $order = Order::where('payment_authority', $authority)->firstOrFail();

        $response = Http::post('https://api.zarinpal.com/pg/v4/payment/verify.json', [
            'merchant_id' => env('ZARINPAL_MERCHANT'),
            'amount' => $order->final_price * 10,
            'authority' => $authority,
        ]);

        $result = $response->json();

        if ($result['data']['code'] == 100) {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'payment_ref_id' => $result['data']['ref_id'],
            ]);
            return "✅ پرداخت با موفقیت انجام شد. شماره پیگیری: " . $result['data']['ref_id'];
        }

        return "❌ پرداخت ناموفق بود.";
    }

    /**
     * پرداخت با IDPay
     */
    private function payWithIdPay(Order $order)
    {
        $response = Http::withHeaders([
            'X-API-KEY' => env('IDPAY_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.idpay.ir/v1.1/payment', [
            'order_id' => $order->order_number,
            'amount' => $order->final_price * 10,
            'callback' => route('idpay.verify'),
            'description' => 'Order #' . $order->order_number,
        ]);

        $data = $response->json();

        if (!isset($data['link'])) {
            return response()->json(['error' => 'IDPay payment init failed', 'data' => $data], 500);
        }

        $order->update([
            'payment_authority' => $data['id'],
        ]);

        return response()->json([
            'payment_url' => $data['link'],
            'order' => $order,
        ]);
    }

    /**
     * تأیید پرداخت از IDPay
     */
    public function verifyIdPay(Request $request)
    {
        $order = Order::where('payment_authority', $request->id)->firstOrFail();

        $response = Http::withHeaders([
            'X-API-KEY' => env('IDPAY_API_KEY'),
        ])->post('https://api.idpay.ir/v1.1/payment/verify', [
            'id' => $request->id,
            'order_id' => $order->order_number,
        ]);

        $data = $response->json();

        if (isset($data['status']) && in_array($data['status'], [100, 101])) {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'payment_ref_id' => $data['track_id'],
            ]);
            return "✅ پرداخت با موفقیت انجام شد (IDPay): " . $data['track_id'];
        }

        return "❌ پرداخت با IDPay ناموفق بود.";
    }
}
