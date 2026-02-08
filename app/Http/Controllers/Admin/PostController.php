<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use App\Models\PostRevision;
use App\Services\ArticleGeneratorService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * 記事一覧の表示
     */
    public function index(Request $request)
    {
        $query = Post::with(['user', 'category', 'tags'])
            ->withCount('comments');

        // ステータスでフィルター
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $posts = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => [
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * 新規記事作成フォームの表示
     */
    public function create()
    {
        $categories = Category::orderBy('order')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Posts/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * 新規記事の保存
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:posts,slug',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'generated_content' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:draft,published,private',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        // スラッグが指定されていない場合はタイトルから自動生成
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // ユーザーIDを追加
        $validated['user_id'] = auth()->id();

        // 公開日時が指定されていない場合で、statusがpublishedの場合は現在時刻を設定
        if (empty($validated['published_at']) && $validated['status'] === 'published') {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);

        // タグの関連付け
        if (!empty($validated['tag_ids'])) {
            $post->tags()->attach($validated['tag_ids']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', '記事を作成しました。');
    }

    /**
     * 記事詳細の表示
     */
    public function show(Post $post)
    {
        $post->load(['user', 'category', 'tags', 'revisions.user']);

        return Inertia::render('Admin/Posts/Show', [
            'post' => $post,
        ]);
    }

    /**
     * 記事編集フォームの表示
     */
    public function edit(Post $post)
    {
        $post->load(['category', 'tags']);
        $categories = Category::orderBy('order')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    /**
     * 記事の更新
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:posts,slug,' . $post->id,
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'generated_content' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:draft,published,private',
            'published_at' => 'nullable|date',
            'featured_image' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
            'change_summary' => 'nullable|string',
        ]);

        // リビジョンの保存（内容に変更がある場合）
        if ($post->content !== $validated['content'] || $post->title !== $validated['title']) {
            PostRevision::create([
                'post_id' => $post->id,
                'user_id' => auth()->id(),
                'title' => $post->title,
                'content' => $post->content,
                'excerpt' => $post->excerpt,
                'change_summary' => $validated['change_summary'] ?? null,
            ]);
        }

        // 公開日時が指定されていない場合で、statusがpublishedに変更される場合は現在時刻を設定
        if (empty($validated['published_at']) && $validated['status'] === 'published' && $post->status !== 'published') {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        // タグの同期
        if (isset($validated['tag_ids'])) {
            $post->tags()->sync($validated['tag_ids']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', '記事を更新しました。');
    }

    /**
     * 記事の削除
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', '記事を削除しました。');
    }

    /**
     * AIで記事を生成
     */
    public function generateArticle(Request $request, ArticleGeneratorService $generator)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'raw_content' => 'required|string',
        ]);

        try {
            $generatedContent = $generator->generateArticle(
                $validated['raw_content'],
                $validated['title']
            );

            return response()->json([
                'success' => true,
                'generated_content' => $generatedContent,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
