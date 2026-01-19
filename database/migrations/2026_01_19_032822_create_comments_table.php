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
        Schema::create('comments', function (Blueprint $table) {
            $table->id(); // コメントID
            $table->foreignId('post_id')->constrained()->onDelete('cascade'); // 記事ID
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // コメント投稿者のユーザーID（ゲストの場合null）
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade'); // 親コメントID（返信機能用）
            $table->string('author_name')->nullable(); // ゲストユーザーの場合の名前
            $table->string('author_email')->nullable(); // ゲストユーザーの場合のメールアドレス
            $table->text('content'); // コメント本文
            $table->enum('status', ['pending', 'approved', 'spam'])->default('pending'); // 承認状態（承認待ち/承認済み/スパム）
            $table->ipAddress('ip_address')->nullable(); // 投稿者のIPアドレス
            $table->timestamps(); // 作成日時・更新日時
            $table->softDeletes(); // 論理削除用

            $table->index('post_id'); // 記事IDでの検索用インデックス
            $table->index(['status', 'created_at']); // 承認済みコメントの検索用インデックス
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
