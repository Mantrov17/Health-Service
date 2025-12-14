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
        Schema::create('slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained('doctors')->cascadeOnDelete();

            $table->dateTimeTz('start_at');
            $table->dateTimeTz('end_at');

            $table->string('status')->default('FREE'); // FREE|BOOKED|BLOCKED
            $table->timestamps();

            $table->unique(['doctor_id', 'start_at', 'end_at']);
            $table->index(['doctor_id', 'start_at']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slots');
    }
};
