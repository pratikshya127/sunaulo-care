<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('medicines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elderly_id')->constrained('elderly_profiles')->cascadeOnDelete();
            $table->string('medicine_name');
            $table->string('dosage', 100);
            $table->string('frequency', 100);
            $table->json('reminder_time')->nullable()->comment('Array of HH:MM times');
            $table->text('instructions')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['elderly_id', 'active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicines');
    }
};
