<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();                // نام برند
            $table->string('slug')->unique();                // برای URL
            $table->string('logo')->nullable();              // مسیر لوگو برند
            $table->text('description')->nullable();         // توضیحات برند
            $table->boolean('is_active')->default(true);     // فعال یا غیرفعال بودن
            $table->integer('order')->default(0);            // ترتیب نمایش در صفحه
            $table->timestamps();
            $table->softDeletes();                           // حذف نرم
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
