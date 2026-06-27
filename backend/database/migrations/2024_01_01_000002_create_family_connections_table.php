<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('family_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('family_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('elderly_id')->constrained('elderly_profiles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['family_user_id', 'elderly_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('family_connections');
    }
};
