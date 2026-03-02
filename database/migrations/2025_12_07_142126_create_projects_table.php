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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique()->isNotEmpty();
            $table->string('title')->unique();
            $table->string('description')->nullable();
            $table->string('image_path')->nullable(); // ESTA SERA LA IMAGEN PRINCIPAL DEL PROYECTO
            $table->string('category')->nullable();
            $table->string('status')->default('En proceso')->nullable();
            $table->json('characteristics')->nullable();
            $table->json('gallery_equirectangular')->nullable();
            $table->string('pdf_path')->nullable();
            $table->enum('orientation', ['horizontal', 'vertical'])->default('vertical');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
