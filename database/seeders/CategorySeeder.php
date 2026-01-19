<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Git',
                'slug' => 'git',
                'description' => 'Gitに関する用語や使い方の解説',
                'order' => 1,
            ],
            [
                'name' => 'Docker',
                'slug' => 'docker',
                'description' => 'Dockerに関する用語やコンテナ技術の解説',
                'order' => 2,
            ],
            [
                'name' => 'Laravel',
                'slug' => 'laravel',
                'description' => 'Laravelフレームワークに関する解説',
                'order' => 3,
            ],
            [
                'name' => 'React',
                'slug' => 'react',
                'description' => 'Reactライブラリに関する解説',
                'order' => 4,
            ],
            [
                'name' => 'PHP',
                'slug' => 'php',
                'description' => 'PHP言語に関する解説',
                'order' => 5,
            ],
            [
                'name' => 'JavaScript',
                'slug' => 'javascript',
                'description' => 'JavaScript言語に関する解説',
                'order' => 6,
            ],
            [
                'name' => 'データベース',
                'slug' => 'database',
                'description' => 'データベースに関する解説',
                'order' => 7,
            ],
            [
                'name' => 'セキュリティ',
                'slug' => 'security',
                'description' => 'セキュリティに関する解説',
                'order' => 8,
            ],
            [
                'name' => 'その他',
                'slug' => 'others',
                'description' => 'その他の技術用語',
                'order' => 99,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
