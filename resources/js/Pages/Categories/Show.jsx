import FrontLayout from '@/Layouts/FrontLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ category, posts }) {
    return (
        <FrontLayout>
            <Head title={`${category.name} - Tech Children`} />

            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-gray-600">{category.description}</p>
                    )}
                </div>

                <div className="space-y-6">
                    {posts.data.map((post) => (
                        <article
                            key={post.id}
                            className="rounded-lg bg-white p-6 shadow"
                        >
                            <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
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

                {posts.data.length === 0 && (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">このカテゴリには記事がありません</p>
                    </div>
                )}

                {/* ページネーション */}
                {posts.links && (
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
        </FrontLayout>
    );
}
