<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medicine_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicine_id')->constrained()->cascadeOnDelete();
            $table->foreignId('elderly_id')->constrained('elderly_profiles')->cascadeOnDelete();
            $table->boolean('taken')->default(false);
            $table->timestamp('taken_time')->nullable();
            $table->string('remarks', 500)->nullable();
            $table->timestamps();

            $table->index(['elderly_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicine_logs');
    }
};
