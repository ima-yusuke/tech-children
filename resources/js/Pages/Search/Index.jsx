import FrontLayout from '@/Layouts/FrontLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ posts, query, categories, popularTags }) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('search'), { q: searchQuery });
    };

    return (
        <FrontLayout>
            <Head title="検索 - Tech Children" />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-3">
                        {/* 検索フォーム */}
                        <form onSubmit={handleSearch} className="mb-8">
                            <div className="flex gap-2">
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="記事を検索..."
                                    className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <button
                                    type="submit"
                                    className="rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                >
                                    検索
                                </button>
                            </div>
                        </form>

                        {query && (
                            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                                「{query}」の検索結果 ({posts.total}件)
                            </h1>
                        )}

                        <div className="space-y-6">
                            {posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-lg bg-white p-6 shadow"
                                >
                                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                                        {post.category && (
                                            <Link
                                                href={route('categories.show', post.category.slug)}
                                                className="text-indigo-600 hover:text-indigo-800"
                                            >
                                                {post.category.name}
                                            </Link>
                                        )}
                                        <span>·</span>
                                        <time>
                                            {new Date(post.published_at).toLocaleDateString('ja-JP')}
                                        </time>
                                    </div>

                                    <h2 className="mb-2 text-xl font-semibold">
                                        <Link
                                            href={route('posts.show', post.slug)}
                                            className="text-gray-900 hover:text-indigo-600"
                                        >
                                            {post.title}
                                        </Link>
                                    </h2>

                                    {post.excerpt && (
                                        <p className="mb-4 text-gray-600">{post.excerpt}</p>
                                    )}

                                    <div className="flex items-center gap-2">
                                        {post.tags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={route('tags.show', tag.slug)}
                                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                            >
                                                {tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {posts.data.length === 0 && query && (
                            <div className="rounded-lg bg-white p-12 text-center shadow">
                                <p className="text-gray-500">
                                    「{query}」に一致する記事が見つかりませんでした
                                </p>
                            </div>
                        )}

                        {!query && (
                            <div className="rounded-lg bg-white p-12 text-center shadow">
                                <p className="text-gray-500">
                                    キーワードを入力して記事を検索してください
                                </p>
                            </div>
                        )}

                        {/* ページネーション */}
                        {posts.links && posts.data.length > 0 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {posts.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`rounded px-3 py-1 ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded px-3 py-1 bg-gray-100 text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* サイドバー */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* カテゴリ */}
                            <div className="rounded-lg bg-white p-6 shadow">
                                <h3 className="mb-4 font-semibold text-gray-900">
                                    カテゴリ
                                </h3>
                                <ul className="space-y-2">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={route('categories.show', category.slug)}
                                                className="flex items-center justify-between text-gray-700 hover:text-indigo-600"
                                            >
                                                <span>{category.name}</span>
                                                <span className="text-sm text-gray-500">
                                                    ({category.posts_count})
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 人気のタグ */}
                            <div className="rounded-lg bg-white p-6 shadow">
                                <h3 className="mb-4 font-semibold text-gray-900">
                                    人気のタグ
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('tags.show', tag.slug)}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
                                        >
                                            {tag.name} ({tag.posts_count})
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </FrontLayout>
    );
}
