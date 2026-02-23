<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>Tech Children - プログラミング初学者のための技術用語辞典</title>
    <meta name="description" content="プログラミング初学者に向けて、難しい技術用語をわかりやすく解説する技術用語辞典サイト。基礎から学べる記事が満載です。">
    <meta name="keywords" content="プログラミング,技術用語,初心者,学習,エンジニア,IT,Web開発,辞典">
    <meta name="author" content="Tech Children">

    <!-- OGP Meta Tags -->
    <meta property="og:title" content="Tech Children - プログラミング初学者のための技術用語辞典">
    <meta property="og:description" content="プログラミング初学者に向けて、難しい技術用語をわかりやすく解説する技術用語辞典サイト。基礎から学べる記事が満載です。">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:site_name" content="Tech Children">
    <meta property="og:locale" content="ja_JP">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Tech Children - プログラミング初学者のための技術用語辞典">
    <meta name="twitter:description" content="プログラミング初学者に向けて、難しい技術用語をわかりやすく解説する技術用語辞典サイト。">

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url('/') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    @vite(['resources/css/app.css', 'resources/css/top.css'])

    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@type": "WebSite",
        "name": "Tech Children",
        "description": "プログラミング初学者のための技術用語辞典",
        "url": "{{ url('/') }}",
        "potentialAction": {
            "@@type": "SearchAction",
            "target": "{{ url('/search') }}?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    }
    </script>
</head>
<body>
    <!-- Header -->
    <header class="top-header">
        <div class="container">
            <div class="header-content">
                <h1 class="site-logo">
                    <a href="/">Tech Children</a>
                </h1>
                <nav class="main-nav">
                    <a href="{{ route('posts.index') }}" class="nav-link">記事一覧</a>
                    <a href="{{ route('search') }}" class="nav-link">検索</a>
                    @auth
                        <a href="{{ route('dashboard') }}" class="nav-link">ダッシュボード</a>
                    @else
                        <a href="{{ route('login') }}" class="nav-link">ログイン</a>
                    @endauth
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-content">
                <h2 class="hero-title">プログラミング初学者のための<br>技術用語辞典</h2>
                <p class="hero-description">
                    難しい技術用語を、わかりやすく丁寧に解説します。<br>
                    基礎から学べる記事で、あなたの学習をサポートします。
                </p>
                <div class="hero-actions">
                    <a href="{{ route('posts.index') }}" class="btn btn-primary">記事を読む</a>
                    <a href="{{ route('search') }}" class="btn btn-secondary">用語を検索</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Section -->
    @if($categories->count() > 0)
    <section class="categories-section">
        <div class="container">
            <h2 class="section-title">カテゴリから探す</h2>
            <div class="categories-grid">
                @foreach($categories as $category)
                <a href="{{ route('categories.show', $category->slug) }}" class="category-card">
                    <h3 class="category-name">{{ $category->name }}</h3>
                    <p class="category-count">{{ $category->posts_count }}件の記事</p>
                </a>
                @endforeach
            </div>
        </div>
    </section>
    @endif

    <!-- Recent Posts Section -->
    @if($recentPosts->count() > 0)
    <section class="posts-section">
        <div class="container">
            <h2 class="section-title">最新の記事</h2>
            <div class="posts-grid">
                @foreach($recentPosts as $post)
                <article class="post-card">
                    <a href="{{ route('posts.show', $post->slug) }}" class="post-link">
                        @if($post->category)
                        <span class="post-category">{{ $post->category->name }}</span>
                        @endif
                        <h3 class="post-title">{{ $post->title }}</h3>
                        @if($post->excerpt)
                        <p class="post-excerpt">{{ Str::limit($post->excerpt, 80) }}</p>
                        @endif
                        <div class="post-meta">
                            <time datetime="{{ $post->published_at }}">
                                {{ $post->published_at->format('Y年n月j日') }}
                            </time>
                            <span class="post-views">{{ number_format($post->view_count) }} views</span>
                        </div>
                    </a>
                </article>
                @endforeach
            </div>
            <div class="section-more">
                <a href="{{ route('posts.index') }}" class="btn btn-outline">すべての記事を見る</a>
            </div>
        </div>
    </section>
    @endif

    <!-- Popular Posts Section -->
    @if($popularPosts->count() > 0)
    <section class="posts-section posts-section-alt">
        <div class="container">
            <h2 class="section-title">人気の記事</h2>
            <div class="posts-grid">
                @foreach($popularPosts as $post)
                <article class="post-card">
                    <a href="{{ route('posts.show', $post->slug) }}" class="post-link">
                        @if($post->category)
                        <span class="post-category">{{ $post->category->name }}</span>
                        @endif
                        <h3 class="post-title">{{ $post->title }}</h3>
                        @if($post->excerpt)
                        <p class="post-excerpt">{{ Str::limit($post->excerpt, 80) }}</p>
                        @endif
                        <div class="post-meta">
                            <time datetime="{{ $post->published_at }}">
                                {{ $post->published_at->format('Y年n月j日') }}
                            </time>
                            <span class="post-views">{{ number_format($post->view_count) }} views</span>
                        </div>
                    </a>
                </article>
                @endforeach
            </div>
        </div>
    </section>
    @endif

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

    <!-- Footer -->
    <footer class="top-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3 class="footer-logo">Tech Children</h3>
                    <p class="footer-description">
                        プログラミング初学者のための<br>技術用語辞典サイト
                    </p>
                </div>
                <nav class="footer-nav">
                    <div class="footer-nav-group">
                        <h4 class="footer-nav-title">コンテンツ</h4>
                        <a href="{{ route('posts.index') }}" class="footer-link">記事一覧</a>
                        <a href="{{ route('search') }}" class="footer-link">検索</a>
                    </div>
                    @auth
                    <div class="footer-nav-group">
                        <h4 class="footer-nav-title">管理</h4>
                        <a href="{{ route('dashboard') }}" class="footer-link">ダッシュボード</a>
                        <a href="{{ route('admin.posts.index') }}" class="footer-link">記事管理</a>
                    </div>
                    @endauth
                </nav>
            </div>
            <div class="footer-bottom">
                <p class="copyright">&copy; {{ date('Y') }} Tech Children. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
