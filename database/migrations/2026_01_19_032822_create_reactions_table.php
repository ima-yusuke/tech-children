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
        Schema::create('reactions', function (Blueprint $table) {
            $table->id(); // リアクションID
            $table->morphs('reactable'); // リアクション対象（記事、コメント等に対応できるポリモーフィック関連）
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // リアクションしたユーザーID
            $table->string('type')->default('like'); // リアクションの種類（例: like, helpful, informative等）
            $table->timestamps(); // 作成日時・更新日時

            $table->unique(['reactable_id', 'reactable_type', 'user_id', 'type']); // 同じユーザーが同じ対象に同じリアクションを複数回できないようにする制約
            $table->index(['reactable_id', 'reactable_type']); // リアクション対象での検索用インデックス
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reactions');
    }
};
