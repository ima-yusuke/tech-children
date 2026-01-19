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
        Schema::create('categories', function (Blueprint $table) {
            $table->id(); // カテゴリID
            $table->string('name')->unique(); // カテゴリ名（例: Git, Docker, Laravel等）
            $table->string('slug')->unique(); // URLスラッグ（例: git, docker, laravel）
            $table->text('description')->nullable(); // カテゴリの説明文
            $table->integer('order')->default(0); // 表示順序
            $table->timestamps(); // 作成日時・更新日時
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
