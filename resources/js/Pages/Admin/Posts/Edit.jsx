import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import { useState } from 'react';
import axios from 'axios';

export default function Edit({ post, categories, tags }) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        generated_content: post.generated_content || '',
        category_id: post.category_id || '',
        status: post.status || 'draft',
        published_at: post.published_at || '',
        featured_image: post.featured_image || '',
        tag_ids: post.tags?.map((tag) => tag.id) || [],
        change_summary: '',
    });

    const [generating, setGenerating] = useState(false);
    const [generateError, setGenerateError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.posts.update', post.id));
    };

    const handleDelete = () => {
        if (confirm('本当に削除しますか?')) {
            router.delete(route('admin.posts.destroy', post.id));
        }
    };

    const handleGenerateArticle = async () => {
        if (!data.title) {
            alert('タイトルを入力してください');
            return;
        }
        if (!data.content) {
            alert('元ネタとなる本文を入力してください');
            return;
        }

        setGenerating(true);
        setGenerateError('');

        try {
            const response = await axios.post(route('admin.posts.generate'), {
                title: data.title,
                raw_content: data.content,
            });

            if (response.data.success) {
                setData('generated_content', response.data.generated_content);
                alert('記事を生成しました！生成された記事は下の「AI生成記事」欄に表示されます。');
            } else {
                setGenerateError(response.data.message || '記事の生成に失敗しました');
            }
        } catch (error) {
            setGenerateError(error.response?.data?.message || '記事の生成に失敗しました');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">記事編集</h2>
            }
        >
            <Head title="記事編集" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel htmlFor="title" value="タイトル" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full"
                                        required
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="slug" value="スラッグ" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="category_id" value="カテゴリ" />
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">選択してください</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category_id} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel value="タグ" />
                                    <div className="mt-2 space-y-2">
                                        {tags.map((tag) => (
                                            <label key={tag.id} className="inline-flex items-center mr-4">
                                                <input
                                                    type="checkbox"
                                                    value={tag.id}
                                                    checked={data.tag_ids.includes(tag.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setData('tag_ids', [...data.tag_ids, tag.id]);
                                                        } else {
                                                            setData(
                                                                'tag_ids',
                                                                data.tag_ids.filter((id) => id !== tag.id),
                                                            );
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="excerpt" value="抜粋" />
                                    <textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        rows="3"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <InputError message={errors.excerpt} className="mt-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <InputLabel htmlFor="content" value="本文（元ネタ）" />
                                        <button
                                            type="button"
                                            onClick={handleGenerateArticle}
                                            disabled={generating || !data.title || !data.content}
                                            className="inline-flex items-center rounded-md bg-purple-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {generating ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    生成中...
                                                </>
                                            ) : (
                                                '✨ AIで記事を生成'
                                            )}
                                        </button>
                                    </div>
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows="15"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                        placeholder="コピペした元ネタをここに貼り付けてください。AIが初学者向けの記事に変換します。"
                                    />
                                    {generateError && (
                                        <p className="mt-2 text-sm text-red-600">{generateError}</p>
                                    )}
                                    <InputError message={errors.content} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">
                                        💡 使い方: タイトルと元ネタを入力後、「AIで記事を生成」ボタンをクリック
                                    </p>
                                </div>

                                {/* AI生成記事 */}
                                {data.generated_content && (
                                    <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                                        <InputLabel htmlFor="generated_content" value="✨ AI生成記事（マークダウン形式）" />
                                        <textarea
                                            id="generated_content"
                                            value={data.generated_content}
                                            onChange={(e) => setData('generated_content', e.target.value)}
                                            rows="20"
                                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
                                        />
                                        <p className="mt-2 text-sm text-purple-700">
                                            📝 こちらが公開される記事です。必要に応じて編集してください。
                                        </p>
                                        <InputError message={errors.generated_content} className="mt-2" />
                                    </div>
                                )}

                                <div>
                                    <InputLabel htmlFor="change_summary" value="変更内容の要約（任意）" />
                                    <TextInput
                                        id="change_summary"
                                        type="text"
                                        value={data.change_summary}
                                        onChange={(e) => setData('change_summary', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="例: 誤字修正、情報追加"
                                    />
                                    <InputError message={errors.change_summary} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="status" value="ステータス" />
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="draft">下書き</option>
                                        <option value="published">公開</option>
                                        <option value="private">限定公開</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <PrimaryButton disabled={processing}>更新</PrimaryButton>
                                        <Link
                                            href={route('admin.posts.index')}
                                            className="text-sm text-gray-600 underline hover:text-gray-900"
                                        >
                                            キャンセル
                                        </Link>
                                    </div>
                                    <DangerButton type="button" onClick={handleDelete}>
                                        削除
                                    </DangerButton>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
