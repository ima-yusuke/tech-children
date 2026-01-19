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
        Schema::create('posts', function (Blueprint $table) {
            $table->id(); // 記事ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 投稿者（管理者）のユーザーID
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null'); // カテゴリID
            $table->string('title'); // 記事タイトル
            $table->string('slug')->unique(); // URLスラッグ
            $table->text('excerpt')->nullable(); // 記事の要約・抜粋
            $table->longText('content'); // 記事本文（ChatGPTからコピペした内容等）
            $table->enum('status', ['draft', 'published', 'private'])->default('draft'); // 公開状態（下書き/公開/限定公開）
            $table->timestamp('published_at')->nullable(); // 公開日時
            $table->integer('view_count')->default(0); // 閲覧数
            $table->string('featured_image')->nullable(); // アイキャッチ画像のパス
            $table->json('meta_data')->nullable(); // SEO用のメタデータ（タイトル、説明等）
            $table->timestamps(); // 作成日時・更新日時
            $table->softDeletes(); // 論理削除用のdeleted_at

            $table->index(['status', 'published_at']); // 公開記事の検索用インデックス
            $table->index('slug'); // スラッグ検索用インデックス
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
