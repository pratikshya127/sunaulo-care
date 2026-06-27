<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elderly_id')->constrained('elderly_profiles')->cascadeOnDelete();
            $table->decimal('blood_pressure_systolic', 6, 1)->nullable();
            $table->decimal('blood_pressure_diastolic', 6, 1)->nullable();
            $table->decimal('sugar_level', 6, 1)->nullable()->comment('mg/dL');
            $table->decimal('weight', 5, 1)->nullable()->comment('kg');
            $table->decimal('temperature', 4, 1)->nullable()->comment('°C');
            $table->decimal('oxygen_level', 4, 1)->nullable()->comment('%');
            $table->unsignedSmallInteger('pulse_rate')->nullable()->comment('bpm');
            $table->decimal('water_intake', 4, 1)->nullable()->comment('litres');
            $table->decimal('sleep_hours', 4, 1)->nullable();
            $table->text('notes')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['elderly_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('health_records');
    }
};
