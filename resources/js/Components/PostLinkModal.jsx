import { useState } from 'react';

export default function PostLinkModal({ isOpen, onClose, posts, onSelectPost }) {
    const [selectedPostId, setSelectedPostId] = useState(null);

    if (!isOpen) return null;

    const handleInsert = () => {
        if (!selectedPostId) {
            alert('記事を選択してください');
            return;
        }

        // 選択された記事を探す
        let selectedPost = null;
        Object.values(posts).forEach(categoryPosts => {
            const found = categoryPosts.find(p => p.id === parseInt(selectedPostId));
            if (found) selectedPost = found;
        });

        if (selectedPost) {
            onSelectPost(selectedPost);
            setSelectedPostId(null);
        }
    };

    const handleClose = () => {
        setSelectedPostId(null);
        onClose();
    };

    const hasNoPosts = Object.keys(posts).length === 0;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            記事リンクを挿入
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4">
                        {hasNoPosts ? (
                            <p className="text-center text-gray-500 py-8">
                                リンク可能な記事がありません
                            </p>
                        ) : (
                            <select
                                size="15"
                                value={selectedPostId || ''}
                                onChange={(e) => setSelectedPostId(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">記事を選択してください</option>
                                {Object.entries(posts).map(([categoryName, categoryPosts]) => (
                                    <optgroup label={`【${categoryName}】`} key={categoryName}>
                                        {categoryPosts.map(post => {
                                            const date = new Date(post.updated_at);
                                            const formattedDate = date.toLocaleDateString('ja-JP');
                                            return (
                                                <option value={post.id} key={post.id}>
                                                    {post.title} ({formattedDate})
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                        <button
                            onClick={handleClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            キャンセル
                        </button>
                        <button
                            onClick={handleInsert}
                            disabled={hasNoPosts}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            挿入
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
