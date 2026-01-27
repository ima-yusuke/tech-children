import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ comments, filters }) {
    const handleStatusChange = (id, status) => {
        router.put(route('admin.comments.update', id), { status });
    };

    const handleDelete = (id) => {
        if (confirm('本当に削除しますか?')) {
            router.delete(route('admin.comments.destroy', id));
        }
    };

    const handleFilterChange = (status) => {
        router.get(route('admin.comments.index'), { status }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    コメント管理
                </h2>
            }
        >
            <Head title="コメント管理" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* フィルター */}
                            <div className="mb-6 flex gap-2">
                                <button
                                    onClick={() => handleFilterChange('all')}
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        !filters?.status || filters.status === 'all'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    全て
                                </button>
                                <button
                                    onClick={() => handleFilterChange('pending')}
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        filters?.status === 'pending'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    保留中
                                </button>
                                <button
                                    onClick={() => handleFilterChange('approved')}
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        filters?.status === 'approved'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    承認済み
                                </button>
                                <button
                                    onClick={() => handleFilterChange('spam')}
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        filters?.status === 'spam'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    スパム
                                </button>
                            </div>

                            {/* コメント一覧 */}
                            <div className="space-y-4">
                                {comments.data.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
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
                                                    記事:{' '}
                                                    <Link
                                                        href={route('posts.show', comment.post.slug)}
                                                        className="text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        {comment.post.title}
                                                    </Link>
                                                    {' · '}
                                                    {new Date(comment.created_at).toLocaleString('ja-JP')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-3 text-gray-700">{comment.content}</div>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route('admin.comments.show', comment.id)}
                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                            >
                                                詳細
                                            </Link>
                                            {comment.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleStatusChange(comment.id, 'approved')}
                                                    className="text-sm text-green-600 hover:text-green-800"
                                                >
                                                    承認
                                                </button>
                                            )}
                                            {comment.status !== 'spam' && (
                                                <button
                                                    onClick={() => handleStatusChange(comment.id, 'spam')}
                                                    className="text-sm text-orange-600 hover:text-orange-800"
                                                >
                                                    スパム
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {comments.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500">コメントがありません</p>
                                </div>
                            )}

                            {/* ページネーション */}
                            {comments.links.length > 3 && (
                                <div className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                                    <div className="flex flex-1 justify-between sm:hidden">
                                        {comments.prev_page_url ? (
                                            <Link
                                                href={comments.prev_page_url}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                前へ
                                            </Link>
                                        ) : (
                                            <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                                                前へ
                                            </span>
                                        )}
                                        {comments.next_page_url ? (
                                            <Link
                                                href={comments.next_page_url}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                次へ
                                            </Link>
                                        ) : (
                                            <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                                                次へ
                                            </span>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">{comments.from}</span>
                                                {' - '}
                                                <span className="font-medium">{comments.to}</span>
                                                {' / '}
                                                <span className="font-medium">{comments.total}</span>
                                                件中
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                                                {comments.links.map((link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                            link.active
                                                                ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                                                : link.url
                                                                  ? 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                                                                  : 'text-gray-400 ring-1 ring-inset ring-gray-300 cursor-not-allowed'
                                                        } ${
                                                            index === 0
                                                                ? 'rounded-l-md'
                                                                : index === comments.links.length - 1
                                                                  ? 'rounded-r-md'
                                                                  : ''
                                                        }`}
                                                        preserveScroll
                                                        disabled={!link.url}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </nav>
                                        </div>
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
