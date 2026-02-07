import { Link } from '@inertiajs/react';
import SEO from '@/Components/SEO';
import '../../../css/posts.css';

export default function Index({ posts, categories, popularTags }) {
    return (
        <>
            <SEO
                title="記事一覧 - Tech Children"
                description="プログラミング初学者向けの技術用語解説記事の一覧ページ。わかりやすく丁寧に解説した記事で学習をサポートします。"
                keywords="プログラミング,技術用語,初心者,学習,記事一覧"
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
                            <Link href={route('posts.index')} className="nav-link active">記事一覧</Link>
                            <Link href={route('search')} className="nav-link">検索</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1 className="page-title">記事一覧</h1>
                    <p className="page-description">プログラミング初学者向けの技術用語解説記事</p>
                </div>
            </section>

            <div className="container">
                <div className="content-layout">
                    {/* Main Content */}
                    <main className="main-content">
                        {posts.data && posts.data.length > 0 ? (
                            <>
                                <div className="posts-grid">
                                    {posts.data.map((post) => (
                                        <article key={post.id} className="post-card">
                                            <Link href={route('posts.show', post.slug)} className="post-link">
                                                {post.category && (
                                                    <span className="post-category">{post.category.name}</span>
                                                )}
                                                <h2 className="post-title">{post.title}</h2>
                                                {post.excerpt && (
                                                    <p className="post-excerpt">
                                                        {post.excerpt.length > 100
                                                            ? post.excerpt.substring(0, 100) + '...'
                                                            : post.excerpt}
                                                    </p>
                                                )}
                                                <div className="post-meta">
                                                    <time dateTime={post.published_at}>
                                                        {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </time>
                                                    <span className="post-views">
                                                        {post.view_count?.toLocaleString()} views
                                                    </span>
                                                </div>
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="post-tags">
                                                        {post.tags.map((tag) => (
                                                            <span key={tag.id} className="post-tag">
                                                                #{tag.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </Link>
                                        </article>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {(posts.prev_page_url || posts.next_page_url) && (
                                    <div className="pagination-wrapper">
                                        <div className="pagination">
                                            {posts.prev_page_url && (
                                                <Link href={posts.prev_page_url} className="pagination-link">
                                                    前のページ
                                                </Link>
                                            )}
                                            <span className="pagination-info">
                                                {posts.current_page} / {posts.last_page}
                                            </span>
                                            {posts.next_page_url && (
                                                <Link href={posts.next_page_url} className="pagination-link">
                                                    次のページ
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <p className="empty-message">記事が見つかりませんでした</p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar */}
                    <aside className="sidebar">
                        {/* Categories */}
                        {categories && categories.length > 0 && (
                            <div className="sidebar-section">
                                <h3 className="sidebar-title">カテゴリ</h3>
                                <ul className="category-list">
                                    {categories.map((category) => (
                                        <li key={category.id} className="category-item">
                                            <Link
                                                href={route('categories.show', category.slug)}
                                                className="category-link"
                                            >
                                                <span className="category-name">{category.name}</span>
                                                <span className="category-count">{category.posts_count}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Popular Tags */}
                        {popularTags && popularTags.length > 0 && (
                            <div className="sidebar-section">
                                <h3 className="sidebar-title">人気のタグ</h3>
                                <div className="tag-cloud">
                                    {popularTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('tags.show', tag.slug)}
                                            className="tag-item"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

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
