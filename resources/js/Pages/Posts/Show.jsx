import FrontLayout from '@/Layouts/FrontLayout';
import SEO from '@/Components/SEO';
import { Link, useForm } from '@inertiajs/react';

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

    return (
        <FrontLayout>
            <SEO
                title={post.title}
                description={post.excerpt || post.content.substring(0, 160)}
                keywords={`${post.tags.map(tag => tag.name).join(',')},技術用語,プログラミング,初心者`}
                ogType="article"
            />

            {/* 記事ヘッダー - グラデーション背景 */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 text-white">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-indigo-100">
                        {post.category && (
                            <Link
                                href={route('categories.show', post.category.slug)}
                                className="rounded-full bg-white/20 px-3 py-1 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg"
                            >
                                {post.category.name}
                            </Link>
                        )}
                        <span className="text-white/70">·</span>
                        <time className="text-white/90">
                            {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <span className="text-white/70">·</span>
                        <span className="text-white/90">{post.view_count} views</span>
                    </div>

                    <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mb-6 text-lg text-indigo-50 sm:text-xl">{post.excerpt}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={route('tags.show', tag.slug)}
                                className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:shadow-lg"
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* 記事本文 */}
                <article className="mb-12 overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="prose prose-lg max-w-none p-8 sm:p-12">
                        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                            {post.content}
                        </div>
                    </div>
                </article>

                {/* 関連記事 */}
                {relatedPosts.length > 0 && (
                    <section className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white">関連記事</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-3">
                                {relatedPosts.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={route('posts.show', related.slug)}
                                        className="group block rounded-lg bg-white p-4 transition-all hover:shadow-md hover:shadow-indigo-200"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <div className="flex h-2 w-2 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:shadow-lg">
                                                </div>
                                            </div>
                                            <span className="text-gray-900 transition-colors group-hover:text-indigo-600">
                                                {related.title}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* コメントセクション */}
                <section className="overflow-hidden rounded-2xl bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">
                            コメント ({comments.length})
                        </h2>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* コメント一覧 */}
                        {comments.length > 0 && (
                            <div className="mb-8 space-y-6">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-xl border-l-4 border-purple-400 bg-gradient-to-r from-purple-50 to-transparent p-4 transition-all hover:shadow-md"
                                    >
                                        <div className="mb-2 flex items-center gap-2 text-sm">
                                            <span className="font-semibold text-gray-900">
                                                {comment.user?.name || comment.author_name}
                                            </span>
                                            <span className="text-gray-400">·</span>
                                            <time className="text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </time>
                                        </div>
                                        <p className="text-gray-800">{comment.content}</p>

                                        {/* 返信コメント */}
                                        {comment.replies?.length > 0 && (
                                            <div className="mt-4 space-y-4 pl-6">
                                                {comment.replies.map((reply) => (
                                                    <div
                                                        key={reply.id}
                                                        className="rounded-lg border-l-2 border-purple-200 bg-white/50 p-3"
                                                    >
                                                        <div className="mb-1 flex items-center gap-2 text-sm">
                                                            <span className="font-medium text-gray-900">
                                                                {reply.user?.name || reply.author_name}
                                                            </span>
                                                            <span className="text-gray-400">·</span>
                                                            <time className="text-gray-500">
                                                                {new Date(reply.created_at).toLocaleDateString('ja-JP')}
                                                            </time>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* コメント投稿フォーム */}
                        <div className="rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50 p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                コメントを投稿
                            </h3>
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                        コメント <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows="4"
                                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                        placeholder="あなたの考えを共有しましょう..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="author_name" className="block text-sm font-medium text-gray-700">
                                            名前 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="author_name"
                                            value={data.author_name}
                                            onChange={(e) => setData('author_name', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                            placeholder="山田太郎"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="author_email" className="block text-sm font-medium text-gray-700">
                                            メールアドレス <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="author_email"
                                            value={data.author_email}
                                            onChange={(e) => setData('author_email', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-pink-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? '投稿中...' : 'コメントを投稿'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </FrontLayout>
    );
}
