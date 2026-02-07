<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * XMLサイトマップを生成
     *
     * 【役割】
     * Googleなどの検索エンジンに、サイト内の全ページを通知するためのXMLを生成します。
     *
     * 【なぜ必要？】
     * - 新しいページを素早くGoogleに発見してもらえる
     * - サイト構造を理解してもらいやすくなる
     * - 検索結果に表示されやすくなる
     */
    public function index()
    {
        // 公開済みの記事を取得（最終更新日でソート）
        $posts = Post::published()
            ->orderBy('updated_at', 'desc')
            ->get();

        // カテゴリーを取得
        $categories = Category::orderBy('updated_at', 'desc')->get();

        // タグを取得
        $tags = Tag::orderBy('updated_at', 'desc')->get();

        // XMLの構築
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // TOPページ
        // priority: 1.0 = 最重要ページ（TOPページは通常最も重要）
        // changefreq: daily = 毎日更新されることを示唆
        $xml .= '<url>';
        $xml .= '<loc>' . url('/') . '</loc>';
        $xml .= '<lastmod>' . now()->toAtomString() . '</lastmod>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>1.0</priority>';
        $xml .= '</url>';

        // 記事一覧ページ
        // priority: 0.9 = 重要なページ
        $xml .= '<url>';
        $xml .= '<loc>' . route('posts.index') . '</loc>';
        $xml .= '<lastmod>' . now()->toAtomString() . '</lastmod>';
        $xml .= '<changefreq>daily</changefreq>';
        $xml .= '<priority>0.9</priority>';
        $xml .= '</url>';

        // 検索ページ
        $xml .= '<url>';
        $xml .= '<loc>' . route('search') . '</loc>';
        $xml .= '<lastmod>' . now()->toAtomString() . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';

        // 各記事ページ
        // priority: 0.8 = コンテンツページとして重要
        // changefreq: weekly = 記事は定期的に更新される可能性がある
        foreach ($posts as $post) {
            $xml .= '<url>';
            $xml .= '<loc>' . route('posts.show', $post->slug) . '</loc>';
            $xml .= '<lastmod>' . $post->updated_at->toAtomString() . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.8</priority>';
            $xml .= '</url>';
        }

        // カテゴリーページ
        // priority: 0.7 = 一覧ページとして中程度の重要性
        foreach ($categories as $category) {
            // slugが存在する場合のみサイトマップに含める
            if ($category->slug) {
                $xml .= '<url>';
                $xml .= '<loc>' . route('categories.show', $category->slug) . '</loc>';
                $xml .= '<lastmod>' . $category->updated_at->toAtomString() . '</lastmod>';
                $xml .= '<changefreq>weekly</changefreq>';
                $xml .= '<priority>0.7</priority>';
                $xml .= '</url>';
            }
        }

        // タグページ
        // priority: 0.6 = 補助的なページとしてやや低めの重要性
        foreach ($tags as $tag) {
            // slugが存在する場合のみサイトマップに含める
            if ($tag->slug) {
                $xml .= '<url>';
                $xml .= '<loc>' . route('tags.show', $tag->slug) . '</loc>';
                $xml .= '<lastmod>' . $tag->updated_at->toAtomString() . '</lastmod>';
                $xml .= '<changefreq>weekly</changefreq>';
                $xml .= '<priority>0.6</priority>';
                $xml .= '</url>';
            }
        }

        $xml .= '</urlset>';

        // XMLとしてレスポンスを返す
        // Content-Type: application/xml でブラウザや検索エンジンに「これはXMLデータですよ」と伝える
        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }
}
