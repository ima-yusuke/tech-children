# 記事リンク挿入機能 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 記事編集ページに他の記事へのMarkdownリンクを挿入できるモーダル機能を追加する

**Architecture:** バックエンドで記事一覧をカテゴリ順にグループ化して取得し、Inertia経由でフロントエンドに渡す。React製モーダルコンポーネントで記事を選択し、カーソル位置にMarkdown形式でリンクを挿入する。

**Tech Stack:** Laravel (PHP), Inertia.js, React, Tailwind CSS

---

## Task 1: バックエンド - 記事一覧データ取得機能追加

**Files:**
- Modify: `app/Http/Controllers/Admin/PostController.php:113-123`

**Step 1: edit()メソッドに記事一覧取得ロジックを追加**

`PostController.php`のedit()メソッド（113-123行）を以下のように修正：

```php
public function edit(Post $post)
{
    $post->load(['category', 'tags']);
    $categories = Category::orderBy('order')->get();
    $tags = Tag::orderBy('name')->get();

    // 他の記事一覧を取得（カテゴリ順 + 更新日順）
    $allPosts = Post::with('category')
        ->where('id', '!=', $post->id) // 現在編集中の記事を除外
        ->where('status', 'published') // 公開済みのみ
        ->orderBy('category_id')
        ->orderBy('updated_at', 'desc')
        ->get(['id', 'title', 'slug', 'category_id', 'updated_at']);

    // カテゴリごとにグループ化
    $postsByCategory = $allPosts->groupBy(function($post) {
        return $post->category ? $post->category->name : '未分類';
    });

    return Inertia::render('Admin/Posts/Edit', [
        'post' => $post,
        'categories' => $categories,
        'tags' => $tags,
        'allPosts' => $postsByCategory,
    ]);
}
```

**Step 2: ブラウザで確認**

Run: `php artisan serve`
Access: http://localhost:8000/admin/posts/1/edit
Expected: ページが正常に表示される（コンソールエラーなし）

**Step 3: Commit**

```bash
git add app/Http/Controllers/Admin/PostController.php
git commit -m "feat: add post list data to edit page for link insertion"
```

---

## Task 2: フロントエンド - PostLinkModalコンポーネント作成

**Files:**
- Create: `resources/js/Components/PostLinkModal.jsx`

**Step 1: PostLinkModal.jsxファイルを作成**

`resources/js/Components/PostLinkModal.jsx`を新規作成：

```jsx
import { useState } from 'react';

export default function PostLinkModal({ isOpen, onClose, posts, onSelectPost }) {
    const [selectedPostId, setSelectedPostId] = useState(null);

    if (!isOpen) return null;

    const handleInsert = () => {
        if (!selectedPostId) {
            alert('記事を選択してください');
            return;
        }

        // 選択された記事を探す
        let selectedPost = null;
        Object.values(posts).forEach(categoryPosts => {
            const found = categoryPosts.find(p => p.id === parseInt(selectedPostId));
            if (found) selectedPost = found;
        });

        if (selectedPost) {
            onSelectPost(selectedPost);
            setSelectedPostId(null);
        }
    };

    const handleClose = () => {
        setSelectedPostId(null);
        onClose();
    };

    const hasNoPosts = Object.keys(posts).length === 0;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            記事リンクを挿入
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4">
                        {hasNoPosts ? (
                            <p className="text-center text-gray-500 py-8">
                                リンク可能な記事がありません
                            </p>
                        ) : (
                            <select
                                size="15"
                                value={selectedPostId || ''}
                                onChange={(e) => setSelectedPostId(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">記事を選択してください</option>
                                {Object.entries(posts).map(([categoryName, categoryPosts]) => (
                                    <optgroup label={`【${categoryName}】`} key={categoryName}>
                                        {categoryPosts.map(post => {
                                            const date = new Date(post.updated_at);
                                            const formattedDate = date.toLocaleDateString('ja-JP');
                                            return (
                                                <option value={post.id} key={post.id}>
                                                    {post.title} ({formattedDate})
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                        <button
                            onClick={handleClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleInsert}
                            disabled={hasNoPosts}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            挿入
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
```

**Step 2: Commit**

```bash
git add resources/js/Components/PostLinkModal.jsx
git commit -m "feat: create PostLinkModal component for link insertion"
```

---

## Task 3: フロントエンド - Edit.jsxにボタンとモーダル統合

**Files:**
- Modify: `resources/js/Pages/Admin/Posts/Edit.jsx:8-11,167-205`

**Step 1: importとstate追加**

`Edit.jsx`の先頭（8行目）にimport追加：

```jsx
import { useState } from 'react';
import axios from 'axios';
import PostLinkModal from '@/Components/PostLinkModal';
```

**Step 2: Props受け取りを修正**

`Edit.jsx`の11行目を修正：

```jsx
export default function Edit({ post, categories, tags, allPosts }) {
```

**Step 3: state追加**

`Edit.jsx`の26行目の後に以下を追加：

```jsx
const [generating, setGenerating] = useState(false);
const [generateError, setGenerateError] = useState('');
const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
```

**Step 4: リンク挿入ハンドラー追加**

`handleGenerateArticle`関数の後（70行目付近）に以下を追加：

```jsx
const handleInsertLink = (selectedPost) => {
    const textarea = document.getElementById('content');
    if (!textarea) {
        console.error('Textarea element not found');
        alert('エラーが発生しました');
        return;
    }

    const cursorPos = textarea.selectionStart;
    const textBefore = data.content.substring(0, cursorPos);
    const textAfter = data.content.substring(cursorPos);
    const linkMarkdown = `[${selectedPost.title}](/posts/${selectedPost.slug})`;

    setData('content', textBefore + linkMarkdown + textAfter);

    // カーソル位置をリンクの後ろに移動
    setTimeout(() => {
        textarea.focus();
        const newCursorPos = cursorPos + linkMarkdown.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);

    setIsLinkModalOpen(false);
};
```

**Step 5: ツールバーエリア修正**

`Edit.jsx`の167-188行目を以下のように修正：

```jsx
<div>
    <div className="flex justify-between items-center mb-2">
        <InputLabel htmlFor="content" value="本文（元ネタ）" />
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
                🔗 記事リンク挿入
            </button>
            <button
                type="button"
                onClick={handleGenerateArticle}
                disabled={generating || !data.title || !data.content}
                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {generating ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        生成中...
                    </>
                ) : (
                    '✨ AIで記事を生成'
                )}
            </button>
        </div>
    </div>
    <textarea
        id="content"
        value={data.content}
        onChange={(e) => setData('content', e.target.value)}
        rows="15"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        required
        placeholder="コピペした元ネタをここに貼り付けてください。AIが初学者向けの記事に変換します。"
    />
    {generateError && (
        <p className="mt-2 text-sm text-red-600">{generateError}</p>
    )}
    <InputError message={errors.content} className="mt-2" />
    <p className="mt-1 text-sm text-gray-500">
        💡 使い方: タイトルと元ネタを入力後、「AIで記事を生成」ボタンをクリック
    </p>
</div>
```

**Step 6: モーダルコンポーネント追加**

`Edit.jsx`のreturn文の最後、`</AuthenticatedLayout>`の直前（272行目付近）に以下を追加：

```jsx
            </AuthenticatedLayout>

            {/* Post Link Modal */}
            <PostLinkModal
                isOpen={isLinkModalOpen}
                onClose={() => setIsLinkModalOpen(false)}
                posts={allPosts || {}}
                onSelectPost={handleInsertLink}
            />
        </>
```

**Step 7: returnをFragmentで囲む**

`Edit.jsx`の72行目を以下のように修正：

```jsx
return (
    <>
        <AuthenticatedLayout
```

**Step 8: Commit**

```bash
git add resources/js/Pages/Admin/Posts/Edit.jsx
git commit -m "feat: integrate PostLinkModal into edit page with toolbar button"
```

---

## Task 4: 動作確認とテスト

**Step 1: npm run devを実行**

Run: `npm run dev`
Expected: ビルドが成功する

**Step 2: ブラウザで確認**

Access: http://localhost:8000/admin/posts/1/edit

確認項目:
- [ ] 「本文（元ネタ）」ラベルの右側に「🔗 記事リンク挿入」ボタンが表示される
- [ ] ボタンをクリックするとモーダルが開く
- [ ] モーダルにカテゴリごとにグループ化された記事一覧が表示される
- [ ] 記事を選択して「挿入」ボタンをクリック
- [ ] カーソル位置に`[記事タイトル](/posts/記事スラッグ)`形式でリンクが挿入される
- [ ] カーソルがリンクの後ろに移動する
- [ ] モーダルが閉じる
- [ ] キャンセルボタンでモーダルが閉じる
- [ ] オーバーレイクリックでモーダルが閉じる

**Step 3: エッジケースのテスト**

- [ ] 記事を選択せずに「挿入」をクリック → アラート表示
- [ ] テキストエリアの先頭、中央、末尾でそれぞれリンク挿入が正しく動作
- [ ] 公開済み記事のみが一覧に表示される
- [ ] 現在編集中の記事が一覧に含まれない

**Step 4: AI生成でリンクが保持されることを確認**

1. 本文にリンクを挿入
2. 「AIで記事を生成」をクリック
3. 生成された記事にリンクが含まれているか確認

**Step 5: 最終Commit**

```bash
git add .
git commit -m "feat: complete post link insertion feature

- Add post list data retrieval in PostController
- Create PostLinkModal component
- Integrate modal into edit page
- Support markdown link insertion at cursor position
- Links are preserved in AI-generated articles

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification Checklist

実装完了後に以下を確認:

- [ ] モーダルが正しく開閉する
- [ ] 記事一覧がカテゴリごとにグループ化されている
- [ ] 記事一覧が更新日降順で表示されている
- [ ] 現在編集中の記事が除外されている
- [ ] 公開済み記事のみが表示されている
- [ ] リンクが正しいMarkdown形式で挿入される
- [ ] カーソル位置が正しく保持される
- [ ] モーダルのUIが既存デザインと統一されている
- [ ] エラーハンドリングが適切に動作する
- [ ] AI生成記事でリンクが保持される

---

## Notes

- **allPostsのデフォルト値**: `allPosts || {}`でundefined対策
- **Fragment追加**: `<PostLinkModal>`を`<AuthenticatedLayout>`の外に配置するため
- **カーソル位置**: `setTimeout`を使用してReactの再レンダリング後にカーソル移動
- **日付フォーマット**: `toLocaleDateString('ja-JP')`で日本語表示

## Future Enhancements

- モーダル内に検索ボックスを追加
- 記事プレビュー機能
- 最近使った記事の表示
- キーボードショートカット（Cmd/Ctrl + K）
