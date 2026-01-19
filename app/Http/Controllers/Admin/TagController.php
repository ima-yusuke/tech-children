<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * タグ一覧の表示
     */
    public function index()
    {
        $tags = Tag::withCount('posts')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * 新規タグ作成フォームの表示
     */
    public function create()
    {
        return Inertia::render('Admin/Tags/Create');
    }

    /**
     * 新規タグの保存
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
            'slug' => 'nullable|string|unique:tags,slug',
            'description' => 'nullable|string',
        ]);

        // スラッグが指定されていない場合は名前から自動生成
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Tag::create($validated);

        return redirect()->route('admin.tags.index')
            ->with('success', 'タグを作成しました。');
    }

    /**
     * タグ編集フォームの表示
     */
    public function edit(Tag $tag)
    {
        return Inertia::render('Admin/Tags/Edit', [
            'tag' => $tag,
        ]);
    }

    /**
     * タグの更新
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
            'slug' => 'nullable|string|unique:tags,slug,' . $tag->id,
            'description' => 'nullable|string',
        ]);

        $tag->update($validated);

        return redirect()->route('admin.tags.index')
            ->with('success', 'タグを更新しました。');
    }

    /**
     * タグの削除
     */
    public function destroy(Tag $tag)
    {
        // タグに関連する記事がある場合でも削除可能（中間テーブルから削除される）
        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'タグを削除しました。');
    }
}
