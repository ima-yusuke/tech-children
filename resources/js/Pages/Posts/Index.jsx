import FrontLayout from '@/Layouts/FrontLayout';
import SEO from '@/Components/SEO';
import { Link } from '@inertiajs/react';

export default function Index({ posts, categories, popularTags }) {
    return (
        <FrontLayout>
            <SEO
                title="技術用語解説 - 初学者向けプログラミング学習"
                description="エンジニア初学者のための技術用語解説サイト。Git、Docker、Laravel、Reactなどの技術を分かりやすく解説。ChatGPTで学んだ内容も共有しています。"
                keywords="技術用語,プログラミング,初心者,エンジニア,Git,Docker,Laravel,React,JavaScript,PHP"
            />

            {/* ヒーローセクション */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Tech Children
                        </h1>
                        <p className="mb-8 text-lg text-indigo-100 sm:text-xl">
                            エンジニア初学者のための技術用語解説サイト
                        </p>
                        <Link
                            href={route('search')}
                            className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
                        >
                            記事を検索
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* メインコンテンツ */}
                    <div className="lg:col-span-3">
                        <h2 className="mb-8 text-2xl font-bold text-gray-900">最新の記事</h2>

                        <div className="space-y-6">
                            {posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="group overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-2xl"
                                >
                                    <div className="p-6">
                                        <div className="mb-3 flex items-center gap-2 text-sm">
                                            {post.category && (
                                                <Link
                                                    href={route('categories.show', post.category.slug)}
                                                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white transition-all hover:shadow-lg"
                                                >
                                                    {post.category.name}
                                                </Link>
                                            )}
                                            <span className="text-gray-400">·</span>
                                            <time className="text-gray-500">
                                                {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-indigo-600">
                                            <Link href={route('posts.show', post.slug)}>
                                                {post.title}
                                            </Link>
                                        </h3>

                                        {post.excerpt && (
                                            <p className="mb-4 line-clamp-2 text-gray-600">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <Link
                                                    key={tag.id}
                                                    href={route('tags.show', tag.slug)}
                                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-indigo-100 hover:text-indigo-700"
                                                >
                                                    #{tag.name}
                                                </Link>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-xs text-gray-500">
                                                    +{post.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {posts.data.length === 0 && (
                            <div className="rounded-xl bg-white p-16 text-center shadow-md">
                                <svg
                                    className="mx-auto mb-4 h-16 w-16 text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="text-gray-500">記事がまだありません</p>
                            </div>
                        )}
                    </div>

                    {/* サイドバー */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* カテゴリ */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-md">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                                    <h3 className="font-semibold text-white">カテゴリ</h3>
                                </div>
                                <ul className="divide-y divide-gray-100 p-4">
                                    {categories.map((category) => (
                                        <li key={category.id} className="py-2">
                                            <Link
                                                href={route('categories.show', category.slug)}
                                                className="flex items-center justify-between text-gray-700 transition-colors hover:text-indigo-600"
                                            >
                                                <span className="font-medium">{category.name}</span>
                                                <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                                                    {category.posts_count}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* 人気のタグ */}
                            <div className="overflow-hidden rounded-xl bg-white shadow-md">
                                <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
                                    <h3 className="font-semibold text-white">人気のタグ</h3>
                                </div>
                                <div className="flex flex-wrap gap-2 p-4">
                                    {popularTags.map((tag) => (
                                        <Link
                                            key={tag.id}
                                            href={route('tags.show', tag.slug)}
                                            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 text-sm font-medium text-purple-800 transition-all hover:from-purple-200 hover:to-pink-200 hover:shadow-md"
                                        >
                                            #{tag.name}
                                            <span className="ml-1 text-xs opacity-75">
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
