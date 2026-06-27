<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receiver_id')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('message');
            $table->string('type', 50)->default('info');
            $table->boolean('read')->default(false);
            $table->timestamps();

            $table->index(['receiver_id', 'read', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
