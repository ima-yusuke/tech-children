import FrontLayout from '@/Layouts/FrontLayout';
import SEO from '@/Components/SEO';
import { Link, useForm } from '@inertiajs/react';
import { Calendar, Eye, Tag, MessageCircle, Send, User, Mail, ArrowRight, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

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

            {/* 記事ヘッダー */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMCAyNGMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bTAtMTJjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0xMiAxMmMwIDIuMjEtMS43OSA0LTQgNHMtNC0xLjc5LTQtNCAxLjc5LTQgNC00IDQgMS43OSA0IDR6bTAtMTJjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0wLTEyYzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHptMTIgMjRjMCAyLjIxLTEuNzkgNC00IDRzLTQtMS43OS00LTQgMS43OS00IDQtNCA0IDEuNzkgNCA0em0wLTEyYzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
                        {post.category && (
                            <Link
                                href={route('categories.show', post.category.slug)}
                                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 font-bold text-white backdrop-blur-sm border border-white/30 transition-all hover:bg-white/30 hover:shadow-lg"
                            >
                                <Tag className="w-4 h-4" />
                                {post.category.name}
                            </Link>
                        )}
                        <span className="text-white/50">·</span>
                        <time className="flex items-center gap-2 text-white/90 font-medium">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.published_at).toLocaleDateString('ja-JP', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </time>
                        <span className="text-white/50">·</span>
                        <span className="flex items-center gap-2 text-white/90 font-medium">
                            <Eye className="w-4 h-4" />
                            {post.view_count} views
                        </span>
                    </div>

                    <h1 className="mb-8 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl leading-tight drop-shadow-lg">
                        {post.title}
                    </h1>

                    {post.excerpt && (
                        <p className="mb-8 text-xl text-white/90 leading-relaxed max-w-3xl">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag.id}
                                href={route('tags.show', tag.slug)}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm border border-white/20 transition-all hover:bg-white/25 hover:scale-105"
                            >
                                <span className="text-white/60">#</span>
                                {tag.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* 記事本文 */}
                <article className="mb-12 overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">
                    <div className="prose prose-lg max-w-none p-8 sm:p-12 lg:p-16" style={{ lineHeight: '1.8' }}>
                        {post.generated_content ? (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        return inline ? (
                                            <code className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-sm font-mono" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                    strong({ children }) {
                                        return <strong className="font-bold text-gray-900">{children}</strong>;
                                    },
                                    blockquote({ children }) {
                                        return (
                                            <blockquote className="border-l-4 border-gray-300 pl-6 py-1 my-8 text-gray-700">
                                                {children}
                                            </blockquote>
                                        );
                                    },
                                    pre({ children }) {
                                        return (
                                            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-8">
                                                {children}
                                            </pre>
                                        );
                                    },
                                    h2({ children }) {
                                        return (
                                            <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-900" style={{ fontSize: '2.25rem', lineHeight: '1.3' }}>
                                                {children}
                                            </h2>
                                        );
                                    },
                                    h3({ children }) {
                                        return (
                                            <h3 className="text-xl font-bold mt-10 mb-4 text-gray-900" style={{ fontSize: '1.5rem', lineHeight: '1.4' }}>
                                                {children}
                                            </h3>
                                        );
                                    },
                                    p({ children }) {
                                        return <p className="my-6 text-gray-800 leading-relaxed">{children}</p>;
                                    },
                                    ul({ children }) {
                                        return <ul className="space-y-2 my-6 pl-6">{children}</ul>;
                                    },
                                    ol({ children }) {
                                        return <ol className="space-y-2 my-6 pl-6">{children}</ol>;
                                    },
                                    li({ children }) {
                                        return <li className="text-gray-800 leading-relaxed">{children}</li>;
                                    },
                                }}
                            >
                                {post.generated_content}
                            </ReactMarkdown>
                        ) : (
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800 text-lg">
                                {post.content}
                            </div>
                        )}
                    </div>
                </article>

                {/* 関連記事 */}
                {relatedPosts.length > 0 && (
                    <section className="mb-12 overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 relative">
                                <ArrowRight className="w-6 h-6" />
                                関連記事
                            </h2>
                        </div>
                        <div className="p-8">
                            <div className="space-y-3">
                                {relatedPosts.map((related) => (
                                    <Link
                                        key={related.id}
                                        href={route('posts.show', related.slug)}
                                        className="group block rounded-2xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-gray-100 p-6 transition-all hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors block mb-1">
                                                    {related.title}
                                                </span>
                                                {related.excerpt && (
                                                    <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* コメントセクション */}
                <section className="overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">
                    <div className="bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 relative">
                            <MessageCircle className="w-6 h-6" />
                            コメント ({comments.length})
                        </h2>
                    </div>

                    <div className="p-8 sm:p-12">
                        {/* コメント一覧 */}
                        {comments.length > 0 && (
                            <div className="mb-12 space-y-6">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="group rounded-2xl border-l-4 border-purple-400 bg-gradient-to-r from-purple-50/50 to-transparent p-6 transition-all hover:shadow-lg hover:from-purple-50"
                                    >
                                        <div className="mb-3 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-md">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-900 block">
                                                    {comment.user?.name || comment.author_name}
                                                </span>
                                                <time className="text-sm text-gray-500 flex items-center gap-1.5">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </time>
                                            </div>
                                        </div>
                                        <p className="text-gray-800 leading-relaxed pl-13">{comment.content}</p>

                                        {/* 返信コメント */}
                                        {comment.replies?.length > 0 && (
                                            <div className="mt-6 space-y-4 pl-6 border-l-2 border-purple-200">
                                                {comment.replies.map((reply) => (
                                                    <div
                                                        key={reply.id}
                                                        className="rounded-xl bg-white/80 p-4 border border-purple-100"
                                                    >
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                                <User className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <span className="font-semibold text-gray-900 text-sm block">
                                                                    {reply.user?.name || reply.author_name}
                                                                </span>
                                                                <time className="text-xs text-gray-500 flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(reply.created_at).toLocaleDateString('ja-JP')}
                                                                </time>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed pl-10">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* コメント投稿フォーム */}
                        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-indigo-50/50 border border-gray-200 p-8">
                            <h3 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Send className="w-5 h-5 text-indigo-600" />
                                コメントを投稿
                            </h3>
                            <form onSubmit={handleCommentSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="content" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4" />
                                        コメント <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows="5"
                                        className="block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                        placeholder="あなたの考えやフィードバックを共有してください..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="author_name" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            名前 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="author_name"
                                            value={data.author_name}
                                            onChange={(e) => setData('author_name', e.target.value)}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                            placeholder="山田太郎"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="author_email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            メールアドレス <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="author_email"
                                            value={data.author_email}
                                            onChange={(e) => setData('author_email', e.target.value)}
                                            className="block w-full rounded-xl border-gray-300 shadow-sm transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                                            placeholder="example@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:from-pink-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <Send className="w-5 h-5" />
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
