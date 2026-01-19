<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * 記事一覧ページ（公開記事のみ）
     */
    public function index(Request $request)
    {
        $query = Post::with(['category', 'tags', 'user'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());

        // カテゴリフィルター
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // タグフィルター
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        $posts = $query->latest('published_at')->paginate(12);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'categories' => Category::withCount('posts')->orderBy('order')->get(),
            'popularTags' => Tag::withCount('posts')->orderBy('posts_count', 'desc')->limit(10)->get(),
        ]);
    }

    /**
     * 記事詳細ページ
     */
    public function show(string $slug)
    {
        $post = Post::with(['category', 'tags', 'user'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        // 閲覧数をインクリメント
        $post->increment('view_count');

        // 承認済みコメントのみ取得（親コメントのみ、返信は含まれる）
        $comments = Comment::with(['user', 'replies.user'])
            ->where('post_id', $post->id)
            ->where('status', 'approved')
            ->whereNull('parent_id')
            ->latest()
            ->get();

        // 関連記事（同じカテゴリの他の記事）
        $relatedPosts = Post::where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->where('status', 'published')
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('Posts/Show', [
            'post' => $post,
            'comments' => $comments,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * コメント投稿
     */
    public function storeComment(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
            'author_name' => 'required_without:user_id|string|max:255',
            'author_email' => 'required_without:user_id|email|max:255',
        ]);

        $commentData = [
            'post_id' => $post->id,
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
            'status' => 'pending', // デフォルトは承認待ち
            'ip_address' => $request->ip(),
        ];

        // 認証済みユーザーの場合
        if (auth()->check()) {
            $commentData['user_id'] = auth()->id();
        } else {
            // ゲストユーザーの場合
            $commentData['author_name'] = $validated['author_name'];
            $commentData['author_email'] = $validated['author_email'];
        }

        Comment::create($commentData);

        return back()->with('success', 'コメントを投稿しました。承認後に表示されます。');
    }

    /**
     * 記事にリアクションを追加
     */
    public function toggleReaction(Request $request, Post $post)
    {
        if (!auth()->check()) {
            return back()->with('error', 'リアクションするにはログインが必要です。');
        }

        $validated = $request->validate([
            'type' => 'required|string|in:like,helpful,informative',
        ]);

        $reaction = $post->reactions()
            ->where('user_id', auth()->id())
            ->where('type', $validated['type'])
            ->first();

        if ($reaction) {
            // 既に同じリアクションがある場合は削除
            $reaction->delete();
            $message = 'リアクションを取り消しました。';
        } else {
            // 新しいリアクションを追加
            $post->reactions()->create([
                'user_id' => auth()->id(),
                'type' => $validated['type'],
            ]);
            $message = 'リアクションを追加しました。';
        }

        return back()->with('success', $message);
    }

    /**
     * ブックマークのトグル
     */
    public function toggleBookmark(Request $request, Post $post)
    {
        if (!auth()->check()) {
            return back()->with('error', 'ブックマークするにはログインが必要です。');
        }

        $bookmark = auth()->user()->bookmarks()
            ->where('post_id', $post->id)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
            $message = 'ブックマークを解除しました。';
        } else {
            auth()->user()->bookmarks()->create([
                'post_id' => $post->id,
                'note' => $request->input('note'),
            ]);
            $message = 'ブックマークに追加しました。';
        }

        return back()->with('success', $message);
    }
}
