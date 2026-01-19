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
        Schema::create('post_tag', function (Blueprint $table) {
            // 記事とタグの多対多リレーション用中間テーブル
            $table->id(); // 中間テーブルID
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // 記事ID
            $table->foreignId('tag_id')->constrained()->onDelete('cascade'); // タグID
            $table->timestamps(); // 作成日時・更新日時

            $table->unique(['post_id', 'tag_id']); // 同じ組み合わせを防ぐユニーク制約
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_tag');
    }
};
