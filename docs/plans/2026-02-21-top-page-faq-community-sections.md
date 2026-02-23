# トップページFAQ・コミュニティセクション追加 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** トップページにFAQセクションとコミュニティセクション（統計・ユーザーの声・SNS）を追加し、学習サイトとしての価値を向上させる

**Architecture:** 既存のtop.blade.phpにHTMLセクションを追加し、TopPageControllerから統計データを渡す。CSSは既存のtop.cssに追加。details/summaryでアコーディオン実装。

**Tech Stack:** Laravel Blade, CSS (Zen Kaku Gothic New), HTML5

---

## Task 1: Controllerに統計データ追加

**Files:**
- Modify: `app/Http/Controllers/TopPageController.php:32`

**Step 1: 統計データをControllerに追加**

TopPageController.phpの`index()`メソッドを以下のように修正：

```php
public function index()
{
    // 最新の記事を取得
    $recentPosts = Post::with(['category', 'tags'])
        ->published()
        ->latest('published_at')
        ->take(6)
        ->get();

    // 人気の記事を取得（閲覧数順）
    $popularPosts = Post::with(['category', 'tags'])
        ->published()
        ->orderBy('view_count', 'desc')
        ->take(6)
        ->get();

    // カテゴリ一覧を取得
    $categories = Category::withCount('posts')
        ->orderBy('order')
        ->get();

    // 統計データを取得
    $totalPosts = Post::published()->count();
    $totalViews = Post::published()->sum('view_count');
    $totalCategories = $categories->count();

    return view('top', compact('recentPosts', 'popularPosts', 'categories', 'totalPosts', 'totalViews', 'totalCategories'));
}
```

**Step 2: ブラウザで確認**

Run: `php artisan serve`
Access: http://localhost:8000
Expected: エラーなく表示される（見た目は変更なし）

**Step 3: Commit**

```bash
git add app/Http/Controllers/TopPageController.php
git commit -m "feat: add statistics data to top page controller"
```

---

## Task 2: FAQセクションのHTML追加

**Files:**
- Modify: `resources/views/top.blade.php:169` (人気の記事セクションの後)

**Step 1: FAQセクションのHTMLを追加**

人気の記事セクション（`@endif`の169行目）の後、フッターの前に以下を追加：

```blade
<!-- FAQ Section -->
<section class="faq-section">
    <div class="container">
        <h2 class="section-title">よくある質問</h2>
        <div class="faq-list">
            <details class="faq-item">
                <summary class="faq-question">
                    <span>Tech Childrenとは？</span>
                    <span class="faq-icon">+</span>
                </summary>
                <div class="faq-answer">
                    <p>Tech Childrenは、プログラミング初学者のための技術用語辞典サイトです。難しい技術用語をわかりやすく丁寧に解説し、基礎から学べる記事を提供しています。</p>
                </div>
            </details>

            <details class="faq-item">
                <summary class="faq-question">
                    <span>どのような記事がありますか？</span>
                    <span class="faq-icon">+</span>
                </summary>
                <div class="faq-answer">
                    <p>プログラミングの基礎概念、開発ツール、Web技術、データベースなど、幅広いカテゴリの技術用語を解説しています。各記事は初学者でも理解できるよう、丁寧な説明と具体例を含めています。</p>
                </div>
            </details>

            <details class="faq-item">
                <summary class="faq-question">
                    <span>会員登録は必要ですか？</span>
                    <span class="faq-icon">+</span>
                </summary>
                <div class="faq-answer">
                    <p>いいえ、すべての記事は会員登録なしで無料で閲覧できます。どなたでも自由に学習していただけます。</p>
                </div>
            </details>

            <details class="faq-item">
                <summary class="faq-question">
                    <span>記事はどのくらいの頻度で更新されますか？</span>
                    <span class="faq-icon">+</span>
                </summary>
                <div class="faq-answer">
                    <p>定期的に新しい記事を追加しており、既存の記事も技術の進化に合わせて更新しています。最新情報は「最新の記事」セクションでご確認ください。</p>
                </div>
            </details>

            <details class="faq-item">
                <summary class="faq-question">
                    <span>おすすめの学習方法は？</span>
                    <span class="faq-icon">+</span>
                </summary>
                <div class="faq-answer">
                    <p>興味のあるカテゴリから始めることをおすすめします。各記事は独立して読めるよう構成されていますが、関連記事へのリンクも用意しているため、体系的に学習を進めることもできます。</p>
                </div>
            </details>
        </div>
    </div>
</section>
```

**Step 2: ブラウザで確認**

Access: http://localhost:8000
Expected: FAQセクションが表示される（スタイルは未適用で基本的な表示）

**Step 3: Commit**

```bash
git add resources/views/top.blade.php
git commit -m "feat: add FAQ section HTML to top page"
```

---

## Task 3: コミュニティセクションのHTML追加

**Files:**
- Modify: `resources/views/top.blade.php` (FAQセクションの後)

**Step 1: コミュニティセクションのHTMLを追加**

FAQセクションの後、フッターの前に以下を追加：

```blade
<!-- Community Section -->
<section class="community-section">
    <div class="container">
        <h2 class="section-title">Tech Childrenコミュニティ</h2>

        <!-- Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">{{ number_format($totalPosts) }}</div>
                <div class="stat-label">記事数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ number_format($totalCategories) }}</div>
                <div class="stat-label">カテゴリ数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">{{ number_format($totalViews) }}</div>
                <div class="stat-label">総閲覧数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">1,000+</div>
                <div class="stat-label">学習者数</div>
            </div>
        </div>

        <!-- Testimonials -->
        <div class="testimonials-section">
            <h3 class="subsection-title">利用者の声</h3>
            <div class="testimonials-grid">
                <div class="testimonial-card">
                    <div class="testimonial-quote">"</div>
                    <p class="testimonial-text">プログラミング用語が難しかったのですが、このサイトのおかげで理解できるようになりました！</p>
                    <p class="testimonial-author">- 初学者Aさん</p>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-quote">"</div>
                    <p class="testimonial-text">わかりやすい説明で、独学でも挫折せずに学べています。</p>
                    <p class="testimonial-author">- 学生Bさん</p>
                </div>
                <div class="testimonial-card">
                    <div class="testimonial-quote">"</div>
                    <p class="testimonial-text">記事の質が高く、実務でも役立っています。</p>
                    <p class="testimonial-author">- エンジニアCさん</p>
                </div>
            </div>
        </div>

        <!-- Social Links -->
        <div class="social-section">
            <h3 class="subsection-title">SNSでフォロー</h3>
            <div class="social-links">
                <a href="https://twitter.com/techchildren" class="btn btn-outline social-btn" target="_blank" rel="noopener noreferrer">
                    Twitter / X
                </a>
                <a href="https://github.com/techchildren" class="btn btn-outline social-btn" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href="{{ url('/feed') }}" class="btn btn-outline social-btn">
                    RSS
                </a>
            </div>
        </div>
    </div>
</section>
```

**Step 2: ブラウザで確認**

Access: http://localhost:8000
Expected: コミュニティセクションが表示される（統計データが動的に表示される、スタイルは未適用）

**Step 3: Commit**

```bash
git add resources/views/top.blade.php
git commit -m "feat: add community section HTML with stats, testimonials, and social links"
```

---

## Task 4: FAQセクションのCSS追加

**Files:**
- Modify: `resources/css/top.css:421` (ファイル末尾)

**Step 1: FAQセクションのCSSを追加**

top.cssのレスポンシブセクションの後に以下を追加：

```css
/* ========================================
   FAQ Section
======================================== */
.faq-section {
    padding: 80px 0;
    background-color: #fff;
}

.faq-list {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.faq-item {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.faq-item:hover {
    border-color: #999;
}

.faq-item[open] {
    border-color: #1a1a1a;
}

.faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
    cursor: pointer;
    list-style: none;
    user-select: none;
}

.faq-question::-webkit-details-marker {
    display: none;
}

.faq-icon {
    font-size: 24px;
    font-weight: 300;
    color: #666;
    transition: transform 0.3s ease;
}

.faq-item[open] .faq-icon {
    transform: rotate(45deg);
}

.faq-answer {
    padding: 0 28px 24px 28px;
    font-size: 15px;
    line-height: 1.8;
    color: #666;
}

.faq-answer p {
    margin: 0;
}
```

**Step 2: ブラウザで確認とアコーディオン動作テスト**

Access: http://localhost:8000
Expected:
- FAQセクションがスタイル適用されている
- 質問をクリックすると回答が開閉する
- アイコンが回転する
- ホバーでボーダー色が変わる

**Step 3: Commit**

```bash
git add resources/css/top.css
git commit -m "style: add FAQ section CSS with accordion functionality"
```

---

## Task 5: コミュニティセクションのCSS追加

**Files:**
- Modify: `resources/css/top.css` (FAQセクションCSSの後)

**Step 1: コミュニティセクションのCSSを追加**

FAQセクションのCSSの後に以下を追加：

```css
/* ========================================
   Community Section
======================================== */
.community-section {
    padding: 80px 0;
    background-color: #fafafa;
}

.subsection-title {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 32px;
    color: #1a1a1a;
    letter-spacing: 0.05em;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 64px;
}

.stat-card {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    padding: 32px 24px;
    text-align: center;
    transition: all 0.3s ease;
}

.stat-card:hover {
    border-color: #999;
    transform: translateY(-2px);
}

.stat-number {
    font-size: 40px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
}

.stat-label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

/* Testimonials */
.testimonials-section {
    margin-bottom: 64px;
}

.testimonials-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
}

.testimonial-card {
    background-color: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    padding: 32px 28px;
    transition: all 0.3s ease;
    position: relative;
}

.testimonial-card:hover {
    border-color: #999;
    transform: translateY(-2px);
}

.testimonial-quote {
    font-size: 48px;
    font-weight: 700;
    color: #e5e5e5;
    line-height: 1;
    margin-bottom: 16px;
}

.testimonial-text {
    font-size: 15px;
    line-height: 1.8;
    color: #333;
    margin-bottom: 16px;
    font-style: italic;
}

.testimonial-author {
    font-size: 13px;
    color: #999;
    font-weight: 500;
    margin: 0;
}

/* Social Links */
.social-section {
    text-align: center;
}

.social-links {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

.social-btn {
    min-width: 140px;
}
```

**Step 2: ブラウザで確認**

Access: http://localhost:8000
Expected:
- コミュニティセクションがスタイル適用されている
- 統計カードが4列に並んでいる
- ユーザーの声が3列に並んでいる
- SNSボタンが中央揃えで表示される
- ホバーエフェクトが動作する

**Step 3: Commit**

```bash
git add resources/css/top.css
git commit -m "style: add community section CSS with stats, testimonials, and social links"
```

---

## Task 6: レスポンシブCSS追加

**Files:**
- Modify: `resources/css/top.css` (既存の`@media (max-width: 768px)`セクション内)

**Step 1: レスポンシブCSSを追加**

既存のレスポンシブセクション（367行目付近）の最後に以下を追加：

```css
    .faq-question {
        font-size: 16px;
        padding: 20px 24px;
    }

    .faq-answer {
        padding: 0 24px 20px 24px;
        font-size: 14px;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 48px;
    }

    .stat-number {
        font-size: 32px;
    }

    .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .testimonials-section {
        margin-bottom: 48px;
    }

    .social-links {
        flex-direction: column;
        gap: 12px;
    }

    .social-btn {
        width: 100%;
    }

    .subsection-title {
        font-size: 18px;
        margin-bottom: 24px;
    }
```

**Step 2: スマホサイズで確認**

ブラウザの開発者ツールでモバイルビュー（375px幅）に変更して確認
Expected:
- 統計カードが2列表示
- ユーザーの声が1列表示
- SNSボタンが縦並び
- FAQ項目が適切なサイズで表示

**Step 3: Commit**

```bash
git add resources/css/top.css
git commit -m "style: add responsive CSS for FAQ and community sections"
```

---

## Task 7: 最終確認とビルド

**Step 1: Viteでアセットをビルド**

Run: `npm run build`
Expected: CSSが正しくコンパイルされる

**Step 2: ブラウザで全体確認**

デスクトップとモバイルの両方で以下を確認：
- [ ] FAQセクションが人気記事の後に表示される
- [ ] アコーディオンが正しく開閉する
- [ ] コミュニティセクションがFAQの後に表示される
- [ ] 統計データが動的に表示される（数値が正しい）
- [ ] ユーザーの声が表示される
- [ ] SNSリンクがクリック可能
- [ ] レスポンシブデザインが機能する
- [ ] 既存セクションに影響がない
- [ ] headタグが変更されていない

**Step 3: 最終Commit**

```bash
git add .
git commit -m "feat: complete FAQ and community sections on top page

- Add FAQ accordion section with 5 common questions
- Add community section with stats, testimonials, and social links
- Add responsive CSS for mobile devices
- Update TopPageController to provide statistics data

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification Checklist

完了後に以下を確認：

- [ ] FAQアコーディオンが正しく開閉する
- [ ] 統計データが動的に表示される（$totalPosts, $totalViews, $totalCategories）
- [ ] デスクトップで統計カードが4列、ユーザーの声が3列
- [ ] モバイルで統計カードが2列、ユーザーの声が1列
- [ ] SNSリンクが正しく設定されている（実際のURLに更新が必要な場合は後で修正）
- [ ] 既存のデザインとの統一感がある
- [ ] ホバーエフェクトが全セクションで動作する
- [ ] headタグに変更がない
- [ ] 他のページに影響がない

---

## Notes

- **SNS URLs**: 現在はプレースホルダー。実際のSNSアカウントURLに後で更新する必要があります
- **学習者数**: 静的な値（1,000+）。将来的にユーザー登録機能を追加する場合は動的に変更可能
- **FAQ内容**: 初期コンテンツ。必要に応じて質問を追加・修正してください
- **ユーザーの声**: 静的コンテンツ。実際のフィードバックを集めて更新することを推奨

## Future Enhancements

- FAQをデータベース管理に移行（管理画面で編集可能に）
- ユーザーの声を動的コンテンツ化
- SNSフォロワー数をAPIから取得して表示
- より詳細な統計情報の追加（今週の新規記事数など）
