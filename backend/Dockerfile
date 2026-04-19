FROM php:8.4-fpm

# system deps
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# اول فقط composer files
COPY composer.json composer.lock ./

# نصب وابستگی‌ها
RUN composer install --no-interaction --no-scripts --no-autoloader

# بعد کل پروژه
COPY . .

# دوباره autoload
RUN composer dump-autoload

# permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
