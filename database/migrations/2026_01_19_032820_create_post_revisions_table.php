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
        Schema::create('post_revisions', function (Blueprint $table) {
            $table->id(); // リビジョンID
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // 記事ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 編集したユーザーID
            $table->string('title'); // その時点のタイトル
            $table->longText('content'); // その時点の本文
            $table->text('excerpt')->nullable(); // その時点の抜粋
            $table->text('change_summary')->nullable(); // 変更内容の要約（例: 誤字修正、情報追加等）
            $table->timestamps(); // 作成日時（リビジョン保存日時）

            $table->index('post_id'); // 記事IDでの検索用インデックス
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_revisions');
    }
};
