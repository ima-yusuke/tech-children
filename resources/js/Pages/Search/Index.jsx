import FrontLayout from '@/Layouts/FrontLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search as SearchIcon, FileText, Calendar, Tag } from 'lucide-react';

export default function Index({ posts, query, categories, popularTags }) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('search'), { q: searchQuery });
    };

    return (
        <FrontLayout>
            <Head title="検索 - Tech Children" />

            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMCAyNGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bTAtMTJjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0xMiAxMmMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bTAtMTJjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0wLTEyYzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMTIgMjRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0wLTEyYzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black mb-4 sm:text-5xl">記事を検索</h1>
                        <p className="text-lg text-white/80">キーワードで知りたい技術を見つけよう</p>
                    </div>

                    <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
                        <div className="relative">
                            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Git、Docker、Laravel..."
                                className="w-full pl-14 pr-32 py-5 rounded-2xl border-0 shadow-2xl text-lg focus:ring-2 focus:ring-white/50 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                検索
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-3">
                        {query && (
                            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    「{query}」の検索結果
                                </h2>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    {posts.total}件の記事が見つかりました
                                </p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:border-gray-200"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative p-8">
                                        <div className="mb-4 flex items-center gap-3 text-sm flex-wrap">
                                            {post.category && (
                                                <Link
                                                    href={route('categories.show', post.category.slug)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-105"
                                                >
                                                    <Tag className="w-3 h-3" />
                                                    {post.category.name}
                                                </Link>
                                            )}
                                            <span className="text-gray-300">·</span>
                                            <time className="text-gray-500 font-medium flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(post.published_at).toLocaleDateString('ja-JP')}
                                            </time>
                                        </div>

                                        <h3 className="mb-3 text-2xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                                            <Link
                                                href={route('posts.show', post.slug)}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="flex-1">{post.title}</span>
                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        </h3>

                                        {post.excerpt && (
                                            <p className="mb-5 text-gray-600 leading-relaxed line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 flex-wrap">
                                            {post.tags.map((tag) => (
                                                <Link
                                                    key={tag.id}
                                                    href={route('tags.show', tag.slug)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 transition-all hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200"
                                                >
                                                    <span className="text-gray-400">#</span>
                                                    {tag.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-indigo-300 transition-all"></div>
                                </article>
                            ))}
                        </div>

                        {posts.data.length === 0 && query && (
                            <div className="rounded-2xl bg-white p-20 text-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <SearchIcon className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    検索結果が見つかりませんでした
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    「{query}」に一致する記事はありません
                                </p>
                                <p className="text-sm text-gray-600">
                                    別のキーワードで検索してみてください
                                </p>
                            </div>
                        )}

                        {!query && (
                            <div className="rounded-2xl bg-white p-20 text-center shadow-sm border border-gray-100">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                    <SearchIcon className="w-10 h-10 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    検索を開始しましょう
                                </h3>
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
                                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-semibold"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    {/* サイドバー */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-6 lg:sticky lg:top-24">
                            {/* カテゴリ */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                                    <h3 className="font-bold text-white flex items-center gap-2 relative">
                                        <Tag className="w-5 h-5" />
                                        カテゴリ
                                    </h3>
                                </div>
                                <ul className="divide-y divide-gray-50 p-2">
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <Link
                                                href={route('categories.show', category.slug)}
                                                className="group flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                                            >
                                                <span className="font-semibold flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                    {category.name}
                                                </span>
                                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 group-hover:bg-indigo-100 text-xs font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                                                    {category.posts_count}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 人気のタグ */}
                            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
                                <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                                    <h3 className="font-bold text-white flex items-center gap-2 relative">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        人気のタグ
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2 p-5">
                                    {popularTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('tags.show', tag.slug)}
                                            className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 px-3 py-2 text-sm font-bold text-purple-800 transition-all hover:from-purple-100 hover:to-pink-100 hover:shadow-md hover:scale-105 hover:border-purple-200"
                                        >
                                            <span className="text-purple-400 group-hover:text-purple-600 transition-colors">#</span>
                                            {tag.name}
                                            <span className="ml-0.5 px-1.5 py-0.5 rounded-md bg-white/60 text-xs font-bold text-purple-700">
                                                {tag.posts_count}
                                            </span>
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
