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
        Schema::table('resource_galleries', function (Blueprint $table) {
            $table->dropColumn('images');
            $table->string('kuula_id')->nullable()->after('title');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resource_galleries', function (Blueprint $table) {
            $table->dropColumn('kuula_id');
            $table->json('images')->nullable();
        });
    }
};
