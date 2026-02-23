# 記事リンク挿入機能 - デザインドキュメント

**作成日**: 2026-02-23
**対象**: 記事編集ページ（/admin/posts/{id}/edit）

## 概要

記事編集ページの「本文（元ネタ）」テキストエリアに、他の記事へのMarkdown形式リンクを簡単に挿入できる機能を追加する。

## 要件

### ユーザー要件
- 記事編集時に他の記事へのリンクを簡単に挿入したい
- ボタンクリックでプルダウンから記事を選択したい
- カテゴリ順で記事を閲覧したい
- AI生成記事でもこのリンクを保持したい

### 技術要件
- **挿入位置**: カーソル位置に挿入
- **リンク形式**: Markdown形式 `[記事タイトル](/posts/記事スラッグ)`
- **並び順**: カテゴリ順 + 更新日順
- **ボタン配置**: ツールバー風（テキストエリアの上）

### 制約事項
- 現在編集中の記事は選択肢に含めない
- 公開済み記事のみを対象とする
- 本文（元ネタ）のテキストエリアのみ対象（AI生成記事欄には挿入しない）

## 選択したアプローチ

**アプローチ1: モーダルダイアログ方式**

理由:
1. 既存UIとの一貫性（AI生成ボタンと同じツールバー配置）
2. 実装コスト（追加ライブラリ不要）
3. 拡張性（後から検索機能やプレビューを追加可能）
4. 使いやすさ（カテゴリごとに整理され直感的）

## アーキテクチャ

### 全体構成

```
PostController::edit()
  ↓
記事一覧データをInertiaで渡す
  ↓
Edit.jsx（記事編集ページ）
  ↓
ツールバーボタンクリック
  ↓
PostLinkModal.jsx（モーダル）
  ↓
記事選択 → 挿入
  ↓
カーソル位置にMarkdown挿入
  ↓
テキストエリアのvalue更新
```

### ファイル構成

**バックエンド:**
- `app/Http/Controllers/Admin/PostController.php` - 修正

**フロントエンド:**
- `resources/js/Pages/Admin/Posts/Edit.jsx` - 修正
- `resources/js/Components/PostLinkModal.jsx` - 新規作成

## コンポーネント設計

### 1. ツールバーボタン（Edit.jsx）

**配置:**
「本文（元ネタ）」ラベルの右側、AI生成ボタンの隣

```jsx
<div className="flex justify-between items-center mb-2">
    <InputLabel htmlFor="content" value="本文（元ネタ）" />
    <div className="flex gap-2">
        <button
            type="button"
            onClick={openLinkModal}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
            🔗 記事リンク挿入
        </button>
        <button /* AI生成ボタン（既存） */>
    </div>
</div>
```

**State追加:**
```javascript
const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
```

---

### 2. PostLinkModalコンポーネント

**新規ファイル:** `resources/js/Components/PostLinkModal.jsx`

**Props:**
- `isOpen: boolean` - モーダル表示状態
- `onClose: () => void` - モーダルを閉じる関数
- `posts: Object` - 記事一覧（カテゴリでグループ化）
- `onSelectPost: (post) => void` - 記事選択時のコールバック

**UI構成:**

```jsx
<Modal isOpen={isOpen} onClose={onClose}>
    {/* ヘッダー */}
    <h2>記事リンクを挿入</h2>
    <button onClick={onClose}>×</button>

    {/* メインエリア */}
    <select size="15" className="...">
        {Object.entries(posts).map(([categoryName, categoryPosts]) => (
            <optgroup label={categoryName} key={categoryName}>
                {categoryPosts.map(post => (
                    <option value={post.id} key={post.id}>
                        {post.title} ({formatDate(post.updated_at)})
                    </option>
                ))}
            </optgroup>
        ))}
    </select>

    {/* フッター */}
    <button onClick={onClose}>キャンセル</button>
    <button onClick={handleInsert}>挿入</button>
</Modal>
```

**モーダルベース:**
既存のTailwind CSSとReactで実装。簡易的なモーダルコンポーネントを作成。

---

### 3. テキストエリア挿入ロジック（Edit.jsx）

```javascript
const handleInsertLink = (post) => {
    const textarea = document.getElementById('content');
    if (!textarea) {
        console.error('Textarea not found');
        alert('エラーが発生しました');
        return;
    }

    const cursorPos = textarea.selectionStart;
    const textBefore = data.content.substring(0, cursorPos);
    const textAfter = data.content.substring(cursorPos);
    const linkMarkdown = `[${post.title}](/posts/${post.slug})`;

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

## データフロー

### バックエンド（PostController::edit()）

**記事一覧の取得クエリ:**

```php
// 現在編集中の記事を除いた公開済み記事を取得
$allPosts = Post::with('category')
    ->where('id', '!=', $post->id) // 自分自身を除外
    ->where('status', 'published') // 公開済みのみ
    ->orderBy('category_id') // カテゴリ順
    ->orderBy('updated_at', 'desc') // 更新日降順
    ->get(['id', 'title', 'slug', 'category_id', 'updated_at']);

// カテゴリごとにグループ化
$postsByCategory = $allPosts->groupBy(function($post) {
    return $post->category ? $post->category->name : '未分類';
});
```

**Inertiaに渡すデータ:**

```php
return Inertia::render('Admin/Posts/Edit', [
    'post' => $post,
    'categories' => $categories,
    'tags' => $tags,
    'allPosts' => $postsByCategory, // 追加
]);
```

### フロントエンド（Edit.jsx）

**Props受け取り:**

```javascript
export default function Edit({ post, categories, tags, allPosts }) {
    // ...
}
```

**モーダル操作:**

```javascript
const openLinkModal = () => setIsLinkModalOpen(true);

const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setSelectedPostId(null);
};
```

## エラーハンドリング

### ケース1: 記事が0件の場合

**モーダル内の表示:**
```jsx
{Object.keys(allPosts).length === 0 ? (
    <p className="text-gray-500 text-center py-8">
        リンク可能な記事がありません
    </p>
) : (
    <select>...</select>
)}
```

**挿入ボタン:**
```jsx
<button disabled={Object.keys(allPosts).length === 0}>
    挿入
</button>
```

---

### ケース2: 記事を選択せずに「挿入」をクリック

```javascript
const handleInsert = () => {
    if (!selectedPostId) {
        alert('記事を選択してください');
        return;
    }
    // 挿入処理
};
```

---

### ケース3: テキストエリアが取得できない

```javascript
const textarea = document.getElementById('content');
if (!textarea) {
    console.error('Textarea element not found');
    alert('エラーが発生しました');
    return;
}
```

---

### ケース4: AI生成記事への挿入

- 「本文（元ネタ）」のテキストエリア（`id="content"`）のみが対象
- AI生成記事欄には挿入しない
- リンクは元ネタに含めることで、AI生成時に自動的に保持される仕様

## UI/UXの詳細

### ボタンデザイン

- **アイコン**: 🔗
- **テキスト**: 「記事リンク挿入」
- **配色**: indigo系（AI生成ボタンと統一）
- **hover効果**: bg-indigo-500

### モーダルデザイン

- **背景**: 半透明のオーバーレイ（rgba(0,0,0,0.5)）
- **モーダル**: 白背景、中央配置、max-width: 600px
- **select**: size="15"で15行表示、スクロール可能
- **optgroup**: カテゴリ名を太字で表示

### select内の表示形式

```
【Web技術】
  HTMLの基礎 (2026-02-20)
  CSSの使い方 (2026-02-19)
【プログラミング】
  JavaScriptの基本 (2026-02-18)
  ...
```

## AI生成記事でのリンク保持

### 仕組み

1. ユーザーが「本文（元ネタ）」にMarkdownリンクを挿入
2. AI生成時に元ネタをClaudeに送信
3. Claudeはマークダウン形式を認識し、リンクを保持したまま記事を生成
4. 生成された記事にもリンクが含まれる

### プロンプトでの指示（既存）

ArticleGeneratorServiceで既にマークダウン形式を指示しているため、追加の対応は不要。

## 将来の拡張性

### Phase 2（オプション）

- **検索機能**: モーダル内に検索ボックスを追加
- **プレビュー**: 選択した記事のプレビューを表示
- **最近使った記事**: 直近で挿入した記事を上部に表示
- **キーボードショートカット**: Cmd/Ctrl + K でモーダル表示

### Phase 3（オプション）

- **オートコンプリート**: `[[`入力でインライン検索
- **記事カードプレビュー**: 記事のサムネイルや抜粋を表示

## テスト項目

### 手動テスト

- [ ] ボタンをクリックしてモーダルが開く
- [ ] モーダル内にカテゴリごとの記事一覧が表示される
- [ ] 記事を選択して「挿入」ボタンをクリック
- [ ] カーソル位置に正しいMarkdown形式でリンクが挿入される
- [ ] カーソル位置がリンクの後ろに移動する
- [ ] モーダルが閉じる
- [ ] 現在編集中の記事が一覧に含まれない
- [ ] 下書き記事が一覧に含まれない
- [ ] 記事が0件の場合、適切なメッセージが表示される
- [ ] AI生成後もリンクが保持される

### エッジケース

- [ ] テキストエリアの先頭に挿入
- [ ] テキストエリアの末尾に挿入
- [ ] テキストエリアの中央に挿入
- [ ] 既存のテキストを選択した状態で挿入
- [ ] 記事が100件以上ある場合のパフォーマンス

## 実装範囲外

- AI生成記事欄への直接挿入（元ネタに含めることで対応）
- 外部サイトへのリンク挿入（別機能として将来検討可能）
- 画像やファイルのリンク挿入
- リンク先記事の削除時の自動更新

## セキュリティ考慮事項

- XSS対策: ReactのJSX内でテキスト展開するため自動エスケープされる
- 権限チェック: 公開済み記事のみを対象とし、下書きは含めない
- 入力検証: バックエンドで記事IDの存在確認は不要（選択式のため）

---

**次のステップ**: 実装プランの作成（writing-plans skill）
