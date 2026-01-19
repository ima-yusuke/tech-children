import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ categories, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category_id: '',
        status: 'draft',
        published_at: '',
        featured_image: '',
        tag_ids: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.posts.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    記事作成
                </h2>
            }
        >
            <Head title="記事作成" />

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
                                    <InputLabel htmlFor="slug" value="スラッグ（任意）" />
                                    <TextInput
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.slug} className="mt-2" />
                                    <p className="mt-1 text-sm text-gray-500">
                                        空欄の場合はタイトルから自動生成されます
                                    </p>
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
                                    <InputError message={errors.tag_ids} className="mt-2" />
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
                                    <InputLabel htmlFor="content" value="本文" />
                                    <textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        rows="15"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    <InputError message={errors.content} className="mt-2" />
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

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>作成</PrimaryButton>
                                    <Link
                                        href={route('admin.posts.index')}
                                        className="text-sm text-gray-600 underline hover:text-gray-900"
                                    >
                                        キャンセル
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
