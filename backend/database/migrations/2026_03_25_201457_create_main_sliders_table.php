<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('main_sliders', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable(); // مسیر ذخیره عکس
            $table->string('link')->nullable(); // URL مقصد اسلاید
            $table->integer('order')->default(0); // ترتیب نمایش
            $table->boolean('is_active')->default(true); // وضعیت فعال/غیرفعال
            $table->timestamps();
            $table->softDeletes(); // برای تاریخ حذف (اختیاری)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sliders');
    }
};
