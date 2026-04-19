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
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('siteID')->nullable();
            $table->unsignedBigInteger('marketerID')->nullable();

            $table->string('uid')->nullable();
            $table->string('type')->nullable();

            $table->string('oauth_provider')->nullable();
            $table->string('oauth_id')->nullable();

            $table->string('username')->nullable();
            $table->string('password')->nullable();

            $table->string('firstname')->nullable();
            $table->string('lastname')->nullable();
            $table->string('gender')->nullable();
            $table->date('birthday')->nullable();

            $table->string('email')->nullable();
            $table->string('company')->nullable();
            $table->string('shopName')->nullable();
            $table->string('job')->nullable();
            $table->string('site')->nullable();

            $table->string('tel')->nullable();
            $table->string('fax')->nullable();
            $table->string('mobile')->nullable();

            $table->string('nationalCode')->nullable();

            $table->unsignedBigInteger('countryID')->nullable();
            $table->string('country')->nullable();

            $table->unsignedBigInteger('provinceID')->nullable();
            $table->string('province')->nullable();

            $table->unsignedBigInteger('cityID')->nullable();
            $table->string('city')->nullable();

            $table->text('address')->nullable();

            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            $table->string('postalCode')->nullable();

            $table->unsignedBigInteger('representerID')->nullable();
            $table->string('representer')->nullable();

            $table->decimal('commissionTolerance', 8, 2)->nullable();

            $table->string('bankName')->nullable();
            $table->string('bankAccount')->nullable();
            $table->string('bankCard')->nullable();
            $table->string('bankSheba')->nullable();

            $table->string('image')->nullable();
            $table->string('cover')->nullable();

            $table->timestamp('date')->nullable();
            $table->string('status')->nullable();

            $table->boolean('VIP')->default(false);
            $table->date('VIPExpireDate')->nullable();
            $table->date('subscriptionExpireDate')->nullable();

            $table->timestamp('lastLoginDate')->nullable();

            $table->string('token')->nullable();
            $table->string('APIToken')->nullable();

            $table->string('marketingCode')->nullable();

            $table->string('emailConfirmationCode')->nullable();
            $table->string('mobileConfirmationCode')->nullable();

            $table->boolean('emailConfirmed')->default(false);
            $table->boolean('mobileConfirmed')->default(false);

            $table->timestamp('confirmationCodeExpireDate')->nullable();

            $table->integer('oldScore')->nullable();
            $table->integer('lastScore')->nullable();
            $table->integer('lastClaimedScore')->nullable();

            $table->string('source')->nullable();
            $table->text('note')->nullable();

            $table->timestamp('lastSeenDate')->nullable();
            $table->timestamp('lastInformedDate')->nullable();

            $table->boolean('sellingEnabled')->default(false);
            $table->boolean('is_foreign')->default(false);

            $table->string('passport_number')->nullable();

            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
