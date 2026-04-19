// database/migrations/2024_01_01_000005_create_orders_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('total_price', 15, 0);
            $table->decimal('discount_amount');
            $table->decimal('final_price', 15, 0);
            $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
                ->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])
                ->default('pending');
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_new')->default(true);
            $table->string('payment_method')->nullable(); // zarinpal , idpay

            $table->string('payment_authority')->nullable();

            $table->string('payment_ref_id')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('total', 15, 0);
            $table->decimal('price', 15, 0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};


