<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * カテゴリ別記事一覧
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $posts = Post::with(['category', 'tags', 'user'])
            ->where('category_id', $category->id)
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->latest('published_at')
            ->paginate(12);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'posts' => $posts,
        ]);
    }
}
