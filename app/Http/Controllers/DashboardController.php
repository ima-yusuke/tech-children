<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Reaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 記事数
        $totalPosts = Post::count();

        // 総閲覧数
        $totalViews = Post::sum('view_count');

        // いいね数（リアクション数）
        $totalReactions = Reaction::count();

        // コメント数
        $totalComments = Comment::where('status', 'approved')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'posts' => $totalPosts,
                'views' => $totalViews,
                'reactions' => $totalReactions,
                'comments' => $totalComments,
            ]
        ]);
    }
}
