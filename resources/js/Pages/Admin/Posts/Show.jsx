import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ post }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        記事詳細
                    </h2>
                    <div className="flex gap-3">
                        <Link
                            href={route('admin.posts.edit', post.id)}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                        >
                            編集
                        </Link>
                        <Link
                            href={route('admin.posts.index')}
                            className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                        >
                            一覧に戻る
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`記事詳細 - ${post.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* 基本情報 */}
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                    {post.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-500">ステータス:</span>
                                        <span
                                            className={`ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                post.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : post.status === 'draft'
                                                      ? 'bg-yellow-100 text-yellow-800'
                                                      : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {post.status === 'published'
                                                ? '公開'
                                                : post.status === 'draft'
                                                  ? '下書き'
                                                  : '限定公開'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">投稿者:</span>
                                        <span className="ml-2 text-gray-900">{post.user?.name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">カテゴリ:</span>
                                        <span className="ml-2 text-gray-900">{post.category?.name || '-'}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">公開日:</span>
                                        <span className="ml-2 text-gray-900">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleString('ja-JP')
                                                : '-'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">作成日:</span>
                                        <span className="ml-2 text-gray-900">
                                            {new Date(post.created_at).toLocaleString('ja-JP')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">更新日:</span>
                                        <span className="ml-2 text-gray-900">
                                            {new Date(post.updated_at).toLocaleString('ja-JP')}
                                        </span>
                                    </div>
                                </div>

                                {/* タグ */}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="mt-4">
                                        <span className="font-medium text-gray-500">タグ:</span>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* スラッグ */}
                                <div className="mt-4">
                                    <span className="font-medium text-gray-500">スラッグ:</span>
                                    <span className="ml-2 text-gray-900 font-mono text-sm">
                                        {post.slug}
                                    </span>
                                </div>
                            </div>

                            {/* 抜粋 */}
                            {post.excerpt && (
                                <div className="mb-8">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">抜粋</h4>
                                    <div className="rounded-lg bg-gray-50 p-4 text-gray-700">
                                        {post.excerpt}
                                    </div>
                                </div>
                            )}

                            {/* 本文 */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">本文</h4>
                                <div className="prose max-w-none rounded-lg border border-gray-200 p-6">
                                    <div className="whitespace-pre-wrap">{post.content}</div>
                                </div>
                            </div>

                            {/* 編集履歴 */}
                            {post.revisions && post.revisions.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">編集履歴</h4>
                                    <div className="space-y-4">
                                        {post.revisions.map((revision) => (
                                            <div
                                                key={revision.id}
                                                className="rounded-lg border border-gray-200 p-4"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-medium text-gray-900">
                                                            {revision.user?.name || '不明'}
                                                        </span>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            {new Date(revision.created_at).toLocaleString('ja-JP')}
                                                        </span>
                                                    </div>
                                                </div>
                                                {revision.change_summary && (
                                                    <div className="text-sm text-gray-700 mb-2">
                                                        変更内容: {revision.change_summary}
                                                    </div>
                                                )}
                                                <details className="text-sm">
                                                    <summary className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                                                        変更前の内容を見る
                                                    </summary>
                                                    <div className="mt-2 rounded bg-gray-50 p-3">
                                                        <div className="font-medium mb-1">タイトル:</div>
                                                        <div className="mb-3">{revision.title}</div>
                                                        {revision.excerpt && (
                                                            <>
                                                                <div className="font-medium mb-1">抜粋:</div>
                                                                <div className="mb-3">{revision.excerpt}</div>
                                                            </>
                                                        )}
                                                        <div className="font-medium mb-1">本文:</div>
                                                        <div className="whitespace-pre-wrap">
                                                            {revision.content}
                                                        </div>
                                                    </div>
                                                </details>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
