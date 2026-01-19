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
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id(); // ブックマークID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // ブックマークしたユーザーID
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // ブックマークした記事ID
            $table->text('note')->nullable(); // ブックマークに対するメモ（後で見返す際の個人メモ）
            $table->timestamps(); // 作成日時・更新日時

            $table->unique(['user_id', 'post_id']); // 同じユーザーが同じ記事を複数回ブックマークできないようにする制約
            $table->index('user_id'); // ユーザーのブックマーク一覧取得用インデックス
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
