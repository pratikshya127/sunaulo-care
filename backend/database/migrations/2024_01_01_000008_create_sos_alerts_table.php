<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sos_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('elderly_id')->constrained('elderly_profiles')->cascadeOnDelete();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->text('message')->nullable();
            $table->enum('status', ['active', 'acknowledged', 'resolved'])->default('active');
            $table->timestamps();

            $table->index(['elderly_id', 'status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sos_alerts');
    }
};
