FROM php:8.3-fpm-alpine

# Update repositories and install system dependencies
RUN apk update && apk add --no-cache \
    postgresql-dev \
    postgresql-client \
    libpng \
    libjpeg-turbo \
    freetype \
    oniguruma \
    libzip \
    icu-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    bash

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create entrypoint script
RUN echo '#!/bin/bash' > /usr/local/bin/docker-entrypoint.sh && \
    echo 'set -e' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'echo "Waiting for database to be ready..."' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'until pg_isready -h ${DB_HOST:-postgres} -p ${DB_PORT:-5432} -U ${DB_USERNAME:-postgres} > /dev/null 2>&1; do' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '    echo "Database is unavailable - sleeping"' >> /usr/local/bin/docker-entrypoint.sh && \
    echo '    sleep 2' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'done' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'echo "Database is ready!"' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'echo "Running migrations..."' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'php artisan migrate --force' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'echo "Migrations completed successfully!"' >> /usr/local/bin/docker-entrypoint.sh && \
    echo 'exec "$@"' >> /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
