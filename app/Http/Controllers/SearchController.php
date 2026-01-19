<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * 記事検索
     */
    public function index(Request $request)
    {
        $query = $request->input('q');

        $posts = Post::with(['category', 'tags', 'user'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->when($query, function ($queryBuilder) use ($query) {
                $queryBuilder->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('content', 'like', "%{$query}%")
                        ->orWhere('excerpt', 'like', "%{$query}%");
                });
            })
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Search/Index', [
            'posts' => $posts,
            'query' => $query,
            'categories' => Category::withCount('posts')->orderBy('order')->get(),
            'popularTags' => Tag::withCount('posts')->orderBy('posts_count', 'desc')->limit(10)->get(),
        ]);
    }
}
