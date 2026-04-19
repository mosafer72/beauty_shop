<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            $table->integer('siteID')->default(0);
            $table->integer('userID');
            $table->integer('marketerID')->nullable();

            $table->tinyInteger('type');
            $table->integer('typeID');
            $table->text('typeOption')->nullable();

            $table->bigInteger('price');
            $table->float('dollarPrice')->nullable();
            $table->string('currency', 20)->nullable()->default('تومان');

            $table->string('discountCode', 255)->nullable();
            $table->integer('discount')->nullable();
            $table->float('dollarDiscount')->nullable();
            $table->integer('walletDiscount')->nullable();
            $table->integer('reserveDiscount')->nullable();

            $table->float('marketingCommissionPercent')->nullable();
            $table->integer('commission')->nullable();

            $table->mediumText('comment')->nullable();

            $table->integer('payMethod');
            $table->integer('date');
            $table->integer('statusDate')->nullable();

            $table->string('gateway', 255)->nullable();
            $table->string('source', 255)->nullable();

            $table->string('refID', 255);
            $table->string('refID2', 255);

            $table->tinyInteger('status');

            // اگر timestamps نداشتی، نذار
            // $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
