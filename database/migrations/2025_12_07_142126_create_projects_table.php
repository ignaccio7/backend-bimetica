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
            $table->string('description');
            $table->string('category');
            $table->string('status')->default('En proceso');
            $table->json('tags');
            $table->json('characteristics');
            $table->json('challenges');
            $table->json('solutions');
            $table->json('gallery_equirectangular')->nullable();
            $table->json('gallery_images')->nullable();
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
