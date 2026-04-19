<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ratings', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            $table->tinyInteger('rating'); // 1 تا 5

            $table->timestamps();

            // جلوگیری از رای تکراری
            $table->unique(['user_id','product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};

