<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Reaction;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

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

        // 最近のアクティビティ（最新5件）
        $recentActivities = $this->getRecentActivities();

        // 今月の成長率
        $growthRates = $this->getMonthlyGrowth();

        return Inertia::render('Dashboard', [
            'stats' => [
                'posts' => $totalPosts,
                'views' => $totalViews,
                'reactions' => $totalReactions,
                'comments' => $totalComments,
            ],
            'recentActivities' => $recentActivities,
            'growthRates' => $growthRates,
        ]);
    }

    /**
     * 最近のアクティビティを取得
     */
    private function getRecentActivities()
    {
        $activities = [];

        // 最近公開された記事
        $recentPosts = Post::where('status', 'published')
            ->latest('published_at')
            ->limit(2)
            ->get(['id', 'title', 'published_at'])
            ->map(function ($post) {
                return [
                    'type' => 'post',
                    'title' => "「{$post->title}」を公開しました",
                    'time' => $post->published_at,
                    'color' => 'text-indigo-600'
                ];
            });

        // 最近承認されたコメント
        $recentComments = Comment::where('status', 'approved')
            ->latest('updated_at')
            ->limit(2)
            ->get(['id', 'content', 'updated_at'])
            ->map(function ($comment) {
                $preview = mb_substr($comment->content, 0, 20) . '...';
                return [
                    'type' => 'comment',
                    'title' => "コメント「{$preview}」を承認しました",
                    'time' => $comment->updated_at,
                    'color' => 'text-blue-600'
                ];
            });

        // 最近作成されたカテゴリ
        $recentCategories = Category::latest('created_at')
            ->limit(1)
            ->get(['id', 'name', 'created_at'])
            ->map(function ($category) {
                return [
                    'type' => 'category',
                    'title' => "カテゴリ「{$category->name}」を追加しました",
                    'time' => $category->created_at,
                    'color' => 'text-emerald-600'
                ];
            });

        // マージして時間順にソート
        $activities = $recentPosts->concat($recentComments)->concat($recentCategories)
            ->sortByDesc('time')
            ->take(5)
            ->values();

        return $activities;
    }

    /**
     * 今月の成長率を計算
     */
    private function getMonthlyGrowth()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();

        // 今月の記事数
        $thisMonthPosts = Post::where('created_at', '>=', $startOfMonth)->count();
        // 先月の記事数
        $lastMonthPosts = Post::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        // 成長率計算
        $postsGrowth = $lastMonthPosts > 0 ? round(($thisMonthPosts / $lastMonthPosts) * 100) : 100;

        // 今月のコメント数
        $thisMonthComments = Comment::where('created_at', '>=', $startOfMonth)->count();
        // 先月のコメント数
        $lastMonthComments = Comment::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();
        // 成長率計算
        $commentsGrowth = $lastMonthComments > 0 ? round(($thisMonthComments / $lastMonthComments) * 100) : 100;

        // 今月の閲覧数（今月公開された記事の閲覧数）
        $thisMonthViews = Post::where('published_at', '>=', $startOfMonth)->sum('view_count');
        // 先月の閲覧数
        $lastMonthViews = Post::whereBetween('published_at', [$startOfLastMonth, $endOfLastMonth])->sum('view_count');
        // 成長率計算
        $viewsGrowth = $lastMonthViews > 0 ? round(($thisMonthViews / $lastMonthViews) * 100) : 100;

        return [
            'posts' => min($postsGrowth, 100), // 最大100%に制限
            'engagement' => min($commentsGrowth, 100),
            'views' => min($viewsGrowth, 100),
        ];
    }
}
