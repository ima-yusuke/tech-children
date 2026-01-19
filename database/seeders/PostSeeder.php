<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 管理者ユーザーを作成（存在しない場合）
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => '管理者',
                'password' => bcrypt('password'),
            ]
        );

        // カテゴリとタグを取得
        $gitCategory = Category::where('slug', 'git')->first();
        $dockerCategory = Category::where('slug', 'docker')->first();
        $laravelCategory = Category::where('slug', 'laravel')->first();

        $beginnerTag = Tag::where('slug', 'beginner')->first();
        $importantTag = Tag::where('slug', 'important')->first();
        $commandTag = Tag::where('slug', 'command')->first();

        // サンプル記事1: Git関連
        $post1 = Post::create([
            'user_id' => $user->id,
            'category_id' => $gitCategory?->id,
            'title' => 'git cloneとは？リポジトリをローカルにコピーする方法',
            'slug' => 'what-is-git-clone',
            'excerpt' => 'git cloneコマンドの基本的な使い方と、リモートリポジトリをローカル環境にコピーする方法を解説します。',
            'content' => "# git cloneとは？\n\ngit cloneは、リモートリポジトリの内容を自分のローカル環境にコピーするためのGitコマンドです。\n\n## 基本的な使い方\n\n```bash\ngit clone https://github.com/username/repository.git\n```\n\n## よくあるオプション\n\n### 特定のブランチをクローンする\n\n```bash\ngit clone -b branch-name https://github.com/username/repository.git\n```\n\n### クローン先のディレクトリ名を指定する\n\n```bash\ngit clone https://github.com/username/repository.git my-project\n```\n\n## まとめ\n\ngit cloneを使うことで、GitHub等のリモートリポジトリを簡単にローカル環境にコピーできます。チーム開発では最初に行う基本的な操作です。",
            'status' => 'published',
            'published_at' => now(),
            'view_count' => 120,
            'meta_data' => [
                'title' => 'git cloneとは？リポジトリをローカルにコピーする方法 | Tech Children',
                'description' => 'git cloneコマンドの基本的な使い方と、リモートリポジトリをローカル環境にコピーする方法を初心者向けに解説します。',
            ],
        ]);
        $post1->tags()->attach([$beginnerTag->id, $commandTag->id]);

        // サンプル記事2: Docker関連
        $post2 = Post::create([
            'user_id' => $user->id,
            'category_id' => $dockerCategory?->id,
            'title' => 'Dockerコンテナとは？仮想化技術の基礎を理解する',
            'slug' => 'what-is-docker-container',
            'excerpt' => 'Dockerコンテナの概念と、従来の仮想マシンとの違いについて、初心者にもわかりやすく解説します。',
            'content' => "# Dockerコンテナとは？\n\nDockerコンテナは、アプリケーションとその実行環境を一つのパッケージにまとめて実行する技術です。\n\n## 仮想マシンとの違い\n\n- **仮想マシン**: OS全体を仮想化\n- **コンテナ**: アプリケーション層のみを仮想化\n\nコンテナの方が軽量で起動が速いという特徴があります。\n\n## 基本的なコマンド\n\n### イメージの取得\n\n```bash\ndocker pull nginx\n```\n\n### コンテナの起動\n\n```bash\ndocker run -d -p 8080:80 nginx\n```\n\n### 起動中のコンテナ確認\n\n```bash\ndocker ps\n```\n\n## まとめ\n\nDockerを使うことで、「私の環境では動くのに...」という問題を解決でき、チーム全体で同じ環境を共有できます。",
            'status' => 'published',
            'published_at' => now()->subDays(1),
            'view_count' => 85,
            'meta_data' => [
                'title' => 'Dockerコンテナとは？仮想化技術の基礎を理解する | Tech Children',
                'description' => 'Dockerコンテナの概念と従来の仮想マシンとの違いを初心者向けに解説。基本的なコマンドも紹介します。',
            ],
        ]);
        $post2->tags()->attach([$beginnerTag->id, $importantTag->id]);

        // サンプル記事3: Laravel関連
        $post3 = Post::create([
            'user_id' => $user->id,
            'category_id' => $laravelCategory?->id,
            'title' => 'Laravelのマイグレーションとは？データベース管理の基礎',
            'slug' => 'what-is-laravel-migration',
            'excerpt' => 'Laravelのマイグレーション機能を使って、データベーススキーマをバージョン管理する方法を学びます。',
            'content' => "# Laravelのマイグレーションとは？\n\nマイグレーションは、データベースのスキーマ（テーブル構造）をコードで管理する機能です。\n\n## なぜマイグレーションを使うのか？\n\n- チームでデータベース構造を共有できる\n- 変更履歴が残る\n- 本番環境への適用が簡単\n\n## 基本的な使い方\n\n### マイグレーションファイルの作成\n\n```bash\nphp artisan make:migration create_users_table\n```\n\n### テーブル定義の記述\n\n```php\nSchema::create('users', function (Blueprint \$table) {\n    \$table->id();\n    \$table->string('name');\n    \$table->string('email')->unique();\n    \$table->timestamps();\n});\n```\n\n### マイグレーションの実行\n\n```bash\nphp artisan migrate\n```\n\n## まとめ\n\nマイグレーションを使うことで、データベースの変更を安全かつ確実に管理できます。",
            'status' => 'published',
            'published_at' => now()->subDays(2),
            'view_count' => 150,
            'meta_data' => [
                'title' => 'Laravelのマイグレーションとは？データベース管理の基礎 | Tech Children',
                'description' => 'Laravelのマイグレーション機能の使い方を初心者向けに解説。データベーススキーマのバージョン管理方法を学びます。',
            ],
        ]);
        $post3->tags()->attach([$beginnerTag->id, $importantTag->id, $commandTag->id]);
    }
}
