<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * カテゴリ一覧の表示
     */
    public function index()
    {
        $categories = Category::withCount('posts')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * 新規カテゴリ作成フォームの表示
     */
    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * 新規カテゴリの保存
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'slug' => 'nullable|string|unique:categories,slug',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        // スラッグが指定されていない場合は名前から自動生成
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Category::create($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'カテゴリを作成しました。');
    }

    /**
     * カテゴリ編集フォームの表示
     */
    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * カテゴリの更新
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'slug' => 'nullable|string|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $category->update($validated);

        return redirect()->route('admin.categories.index')
            ->with('success', 'カテゴリを更新しました。');
    }

    /**
     * カテゴリの削除
     */
    public function destroy(Category $category)
    {
        // カテゴリに属する記事がある場合は削除できない
        if ($category->posts()->count() > 0) {
            return back()->with('error', 'このカテゴリには記事が存在するため削除できません。');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'カテゴリを削除しました。');
    }
}
