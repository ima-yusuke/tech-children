import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ comment }) {
    const handleStatusChange = (status) => {
        router.put(route('admin.comments.update', comment.id), { status });
    };

    const handleDelete = (id) => {
        if (confirm('本当に削除しますか?')) {
            router.delete(route('admin.comments.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        コメント詳細
                    </h2>
                    <Link
                        href={route('admin.comments.index')}
                        className="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
                    >
                        一覧に戻る
                    </Link>
                </div>
            }
        >
            <Head title="コメント詳細" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* コメント本体 */}
                            <div className="mb-6 rounded-lg border border-gray-200 p-4">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {comment.user?.name || comment.author_name || '匿名'}
                                            </span>
                                            <span
                                                className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                    comment.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : comment.status === 'pending'
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {comment.status === 'approved'
                                                    ? '承認済み'
                                                    : comment.status === 'pending'
                                                      ? '保留中'
                                                      : 'スパム'}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            {comment.author_email && (
                                                <span className="mr-3">
                                                    メール: {comment.author_email}
                                                </span>
                                            )}
                                            <span>
                                                {new Date(comment.created_at).toLocaleString('ja-JP')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="mb-2 text-sm font-medium text-gray-500">
                                        記事:
                                    </div>
                                    <Link
                                        href={route('posts.show', comment.post.slug)}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        {comment.post.title}
                                    </Link>
                                </div>

                                <div className="mb-4">
                                    <div className="mb-2 text-sm font-medium text-gray-500">
                                        コメント内容:
                                    </div>
                                    <div className="whitespace-pre-wrap text-gray-700">
                                        {comment.content}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {comment.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange('approved')}
                                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
                                        >
                                            承認
                                        </button>
                                    )}
                                    {comment.status !== 'pending' && (
                                        <button
                                            onClick={() => handleStatusChange('pending')}
                                            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-500"
                                        >
                                            保留
                                        </button>
                                    )}
                                    {comment.status !== 'spam' && (
                                        <button
                                            onClick={() => handleStatusChange('spam')}
                                            className="rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500"
                                        >
                                            スパム
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>

                            {/* 返信コメント */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                        返信 ({comment.replies.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {comment.replies.map((reply) => (
                                            <div
                                                key={reply.id}
                                                className="ml-8 rounded-lg border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <div className="mb-2 flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {reply.user?.name || reply.author_name || '匿名'}
                                                    </span>
                                                    <span
                                                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                            reply.status === 'approved'
                                                                ? 'bg-green-100 text-green-800'
                                                                : reply.status === 'pending'
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {reply.status === 'approved'
                                                            ? '承認済み'
                                                            : reply.status === 'pending'
                                                              ? '保留中'
                                                              : 'スパム'}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(reply.created_at).toLocaleString('ja-JP')}
                                                    </span>
                                                </div>
                                                <div className="whitespace-pre-wrap text-gray-700">
                                                    {reply.content}
                                                </div>
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
