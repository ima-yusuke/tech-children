import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ posts, query }) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('search'), { q: searchQuery });
    };

    return (
        <>
            <Head title="検索 - Tech Children" />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-tight">
                            <a
                                href="/"
                                onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
                                className="text-gray-900 hover:opacity-70 transition-opacity"
                            >
                                Tech Children
                            </a>
                        </h1>
                        <nav className="flex gap-8">
                            <a
                                href="/"
                                onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                ホーム
                            </a>
                            <Link
                                href={route('posts.index')}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                記事一覧
                            </Link>
                            <Link
                                href={route('search')}
                                className="text-sm font-medium text-gray-900 font-semibold"
                            >
                                検索
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Search Section */}
            <section className="bg-white py-20 border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">記事を検索</h1>
                        <p className="text-base text-gray-600">キーワードで知りたい技術を見つけよう</p>
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Git、Docker、Laravel..."
                                className="w-full px-6 py-4 text-base border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                検索
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {query && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            「{query}」の検索結果
                        </h2>
                        <p className="text-sm text-gray-600">
                            {posts.total}件の記事が見つかりました
                        </p>
                    </div>
                )}

                {posts.data && posts.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="bg-white border border-gray-200 overflow-hidden transition-all hover:border-gray-400 hover:-translate-y-0.5"
                                >
                                    <Link
                                        href={route('posts.show', post.slug)}
                                        className="block p-7"
                                    >
                                        {post.category && (
                                            <span className="inline-block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
                                                {post.category.name}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
                                            {post.title}
                                        </h3>
                                        {post.excerpt && (
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <time dateTime={post.published_at}>
                                                {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                            <span>{post.view_count?.toLocaleString()} views</span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="text-xs text-gray-500"
                                                    >
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
                            <div className="flex justify-center items-center gap-6 mt-14 pt-14 border-t border-gray-200">
                                {posts.prev_page_url && (
                                    <Link
                                        href={posts.prev_page_url}
                                        className="px-6 py-3 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        前のページ
                                    </Link>
                                )}
                                <span className="text-sm text-gray-500">
                                    {posts.current_page} / {posts.last_page}
                                </span>
                                {posts.next_page_url && (
                                    <Link
                                        href={posts.next_page_url}
                                        className="px-6 py-3 text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        次のページ
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                ) : query ? (
                    <div className="text-center py-20">
                        <p className="text-base text-gray-500">該当する記事が見つかりませんでした</p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-base text-gray-500">キーワードを入力して検索してください</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 mt-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
                        <div>
                            <h3 className="text-xl font-bold mb-3 tracking-tight">Tech Children</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                プログラミング初学者のための<br />技術用語辞典サイト
                            </p>
                        </div>
                        <nav>
                            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">コンテンツ</h4>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="/"
                                    onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    ホーム
                                </a>
                                <Link
                                    href={route('posts.index')}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    記事一覧
                                </Link>
                                <Link
                                    href={route('search')}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    検索
                                </Link>
                            </div>
                        </nav>
                    </div>
                    <div className="pt-8 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-600">
                            &copy; {new Date().getFullYear()} Tech Children. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
