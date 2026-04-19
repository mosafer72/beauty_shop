<?php


namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{

    public function index()
    {
        $user = auth()->user();

        $cart = Cart::with('items.product')
            ->firstOrCreate([
                'user_id'=>$user->id
            ]);

        $items = [];
        $total = 0;

        foreach($cart->items as $item){

            $product = $item->product;

            $price = $product->discount_price ?? $product->price;

            $item_total = $price * $item->quantity;

            $total += $item_total;

            $items[] = [
                'id'=>$item->id,
                'product_id'=>$product->id,
                'name'=>$product->name,
                'image'=>$product->image,
                'price'=>$product->price,
                'discount_price'=>$product->discount_price,
                'final_price'=>$price,
                'quantity'=>$item->quantity,
                'item_total'=>$item_total
            ];
        }

        return response()->json([
            'items'=>$items,
            'total_price'=>$total
        ]);
    }

    public function add(Request $request)
    {

        $request->validate([
            'product_id'=>'required|exists:products,id',
            'quantity'=>'required|integer|min:1'
        ]);

        $user = auth()->user();

        $product = Product::findOrFail($request->product_id);

        if($product->stock < $request->quantity){

            return response()->json([
                'message'=>'Stock not enough'
            ],400);
        }

        $cart = Cart::firstOrCreate([
            'user_id'=>$user->id
            //need to update
        ]);

        $item = CartItem::where('cart_id',$cart->id)
            ->where('product_id',$product->id)
            ->first();

        if($item){

            $newQuantity = $item->quantity + $request->quantity;

            if($product->stock < $newQuantity){

                return response()->json([
                    'message'=>'Stock limit reached'
                ],400);
            }

            $item->update([
                'quantity'=>$newQuantity
            ]);

        }else{

            CartItem::create([
                'cart_id'=>$cart->id,
                'product_id'=>$product->id,
                'quantity'=>$request->quantity
            ]);
        }

        return response()->json([
            'message'=>'Product added to cart'
        ]);
    }

    public function update(Request $request,$id)
    {

        $request->validate([
            'quantity'=>'required|integer|min:1'
        ]);

        $item = CartItem::findOrFail($id);

        $product = $item->product;

        if($product->stock < $request->quantity){

            return response()->json([
                'message'=>'Stock not enough'
            ],400);
        }

        $item->update([
            'quantity'=>$request->quantity
        ]);

        return response()->json([
            'message'=>'Cart updated'
        ]);
    }

    public function remove($id)
    {

        $item = CartItem::findOrFail($id);

        $item->delete();

        return response()->json([
            'message'=>'Item removed'
        ]);
    }

    public function clear()
    {

        $user = auth()->user();

        $cart = Cart::where('user_id',$user->id)->first();

        if($cart){

            $cart->items()->delete();
        }

        return response()->json([
            'message'=>'Cart cleared'
        ]);
    }

}
