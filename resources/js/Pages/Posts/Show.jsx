import { Link, useForm } from '@inertiajs/react';
import SEO from '@/Components/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github.css';
import '../../../css/post-detail.css';

export default function Show({ post, comments, relatedPosts }) {
    const { data, setData, post: submit, processing } = useForm({
        content: '',
        author_name: '',
        author_email: '',
    });

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        submit(route('posts.comments.store', post.id), {
            onSuccess: () => {
                setData({
                    content: '',
                    author_name: '',
                    author_email: '',
                });
            },
        });
    };

    // 構造化データ（JSON-LD）の生成
    // 【役割】Googleなどの検索エンジンが記事の内容を理解しやすくする
    // 【効果】検索結果に著者名・公開日・評価などが表示される（リッチスニペット）
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt || post.content.substring(0, 160),
        "datePublished": post.published_at,
        "dateModified": post.updated_at,
        "author": {
            "@type": "Organization",
            "name": "Tech Children"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Tech Children",
            "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/images/logo.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    return (
        <>
            <SEO
                title={`${post.title} - Tech Children`}
                description={post.excerpt || post.content.substring(0, 160)}
                keywords={`${post.tags.map(tag => tag.name).join(',')},技術用語,プログラミング,初心者`}
                ogType="article"
            />

            {/* 構造化データをHTMLに埋め込む */}
            {/* dangerouslySetInnerHTML: Reactで生のHTMLを埋め込むための特殊な属性 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            {/* Header */}
            <header className="site-header">
                <div className="container">
                    <div className="header-content">
                        <h1 className="site-logo">
                            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>Tech Children</a>
                        </h1>
                        <nav className="main-nav">
                            <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="nav-link">ホーム</a>
                            <Link href={route('posts.index')} className="nav-link">記事一覧</Link>
                            <Link href={route('search')} className="nav-link">検索</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Article */}
            <article className="article">
                {/* Article Header */}
                <header className="article-header">
                    <div className="container-narrow">
                        {post.category && (
                            <Link
                                href={route('categories.show', post.category.slug)}
                                className="article-category"
                            >
                                {post.category.name}
                            </Link>
                        )}
                        <h1 className="article-title">{post.title}</h1>
                        <div className="article-meta">
                            <time dateTime={post.published_at}>
                                {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            <span className="meta-separator">·</span>
                            <span className="article-views">{post.view_count?.toLocaleString()} views</span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <div className="article-tags">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={route('tags.show', tag.slug)}
                                        className="article-tag"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </header>

                {/* Article Body */}
                <div className="article-body">
                    <div className="container-narrow">
                        <div className="article-content markdown-body">
                            {post.generated_content ? (
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            return inline ? (
                                                <code className="inline-code" {...props}>
                                                    {children}
                                                </code>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        },
                                        strong({ children }) {
                                            return <strong className="font-bold">{children}</strong>;
                                        },
                                        blockquote({ children }) {
                                            return (
                                                <blockquote className="blockquote">
                                                    {children}
                                                </blockquote>
                                            );
                                        },
                                        pre({ children }) {
                                            return (
                                                <pre className="code-block">
                                                    {children}
                                                </pre>
                                            );
                                        },
                                        h2({ children }) {
                                            return (
                                                <h2 className="heading-2">
                                                    {children}
                                                </h2>
                                            );
                                        },
                                        h3({ children }) {
                                            return (
                                                <h3 className="heading-3">
                                                    {children}
                                                </h3>
                                            );
                                        },
                                        p({ children }) {
                                            return <p className="paragraph">{children}</p>;
                                        },
                                        ul({ children }) {
                                            return <ul className="list-unordered">{children}</ul>;
                                        },
                                        ol({ children }) {
                                            return <ol className="list-ordered">{children}</ol>;
                                        },
                                        li({ children }) {
                                            return <li className="list-item">{children}</li>;
                                        },
                                    }}
                                >
                                    {post.generated_content}
                                </ReactMarkdown>
                            ) : (
                                <div className="raw-content">{post.content}</div>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className="py-16 bg-gray-50 border-t border-gray-200">
                    <div className="max-w-4xl mx-auto px-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">関連記事</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((related) => (
                                <article key={related.id} className="bg-white border border-gray-200 overflow-hidden transition-all hover:border-gray-400 hover:-translate-y-0.5">
                                    <Link href={route('posts.show', related.slug)} className="block p-6">
                                        {related.category && (
                                            <span className="inline-block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                                {related.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-base font-semibold text-gray-900 mb-3 leading-snug line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <div className="text-xs text-gray-500">
                                            <time dateTime={related.published_at}>
                                                {new Date(related.published_at).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Comments Section */}
            <section className="comments-section">
                <div className="container-narrow">
                    <h2 className="section-title">コメント ({comments.length})</h2>

                    {/* Comments List */}
                    {comments.length > 0 && (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {comment.user?.name || comment.author_name}
                                        </span>
                                        <time className="comment-date" dateTime={comment.created_at}>
                                            {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </time>
                                    </div>
                                    <div className="comment-body">
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Comment Form */}
                    <div className="comment-form-wrapper">
                        <h3 className="comment-form-title">コメントを投稿</h3>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            <div className="form-group">
                                <label htmlFor="content" className="form-label">
                                    コメント <span className="required">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    rows="5"
                                    className="form-input"
                                    placeholder="あなたの考えやフィードバックを共有してください..."
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="author_name" className="form-label">
                                        名前 <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="author_name"
                                        value={data.author_name}
                                        onChange={(e) => setData('author_name', e.target.value)}
                                        className="form-input"
                                        placeholder="山田太郎"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="author_email" className="form-label">
                                        メールアドレス <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="author_email"
                                        value={data.author_email}
                                        onChange={(e) => setData('author_email', e.target.value)}
                                        className="form-input"
                                        placeholder="example@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'コメント投稿中...' : 'コメントを投稿'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3 className="footer-logo">Tech Children</h3>
                            <p className="footer-description">
                                プログラミング初学者のための<br />技術用語辞典サイト
                            </p>
                        </div>
                        <nav className="footer-nav">
                            <div className="footer-nav-group">
                                <h4 className="footer-nav-title">コンテンツ</h4>
                                <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} className="footer-link">ホーム</a>
                                <Link href={route('posts.index')} className="footer-link">記事一覧</Link>
                                <Link href={route('search')} className="footer-link">検索</Link>
                            </div>
                        </nav>
                    </div>
                    <div className="footer-bottom">
                        <p className="copyright">&copy; {new Date().getFullYear()} Tech Children. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
