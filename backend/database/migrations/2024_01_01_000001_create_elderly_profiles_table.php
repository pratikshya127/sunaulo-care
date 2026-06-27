<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('elderly_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('age')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('blood_group', 10)->nullable();
            $table->json('medical_conditions')->nullable();
            $table->foreignId('caregiver_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('elderly_profiles');
    }
};
