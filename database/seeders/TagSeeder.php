<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => '初心者向け', 'slug' => 'beginner', 'description' => '初学者向けの内容'],
            ['name' => '重要', 'slug' => 'important', 'description' => '特に重要な内容'],
            ['name' => 'よく使う', 'slug' => 'frequently-used', 'description' => '実務でよく使う内容'],
            ['name' => 'トラブルシューティング', 'slug' => 'troubleshooting', 'description' => '問題解決に関する内容'],
            ['name' => 'ベストプラクティス', 'slug' => 'best-practice', 'description' => '推奨される方法'],
            ['name' => 'コマンド', 'slug' => 'command', 'description' => 'コマンド関連'],
            ['name' => '設定', 'slug' => 'configuration', 'description' => '設定に関する内容'],
            ['name' => 'デバッグ', 'slug' => 'debug', 'description' => 'デバッグ関連'],
            ['name' => 'パフォーマンス', 'slug' => 'performance', 'description' => 'パフォーマンス改善関連'],
            ['name' => 'セキュリティ', 'slug' => 'security', 'description' => 'セキュリティ関連'],
        ];

        foreach ($tags as $tag) {
            Tag::create($tag);
        }
    }
}
