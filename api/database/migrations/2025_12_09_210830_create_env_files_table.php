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
        Schema::create('env_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('environment', 50);
            $table->unsignedInteger('version')->default(1);
            $table->text('encrypted_content');
            $table->string('checksum', 64);
            $table->timestamps();

            $table->unique(['project_id', 'environment', 'version']);
            $table->index(['project_id', 'environment']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('env_files');
    }
};
