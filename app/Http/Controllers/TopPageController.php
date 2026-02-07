<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;

class TopPageController extends Controller
{
    public function index()
    {
        // 最新の記事を取得
        $recentPosts = Post::with(['category', 'tags'])
            ->published()
            ->latest('published_at')
            ->take(6)
            ->get();

        // 人気の記事を取得（閲覧数順）
        $popularPosts = Post::with(['category', 'tags'])
            ->published()
            ->orderBy('view_count', 'desc')
            ->take(6)
            ->get();

        // カテゴリ一覧を取得
        $categories = Category::withCount('posts')
            ->orderBy('order')
            ->get();

        return view('top', compact('recentPosts', 'popularPosts', 'categories'));
    }
}
