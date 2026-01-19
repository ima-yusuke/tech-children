import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function FrontLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
            {/* ヘッダー */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* ロゴ */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                                <span className="text-xl font-bold text-white">TC</span>
                            </div>
                            <span className="hidden text-xl font-bold text-gray-900 sm:block">
                                Tech Children
                            </span>
                        </Link>

                        {/* デスクトップナビゲーション */}
                        <nav className="hidden md:flex md:items-center md:space-x-8">
                            <Link
                                href="/"
                                className="text-gray-700 transition-colors hover:text-indigo-600"
                            >
                                ホーム
                            </Link>
                            <Link
                                href={route('search')}
                                className="text-gray-700 transition-colors hover:text-indigo-600"
                            >
                                検索
                            </Link>
                            <Link
                                href={route('login')}
                                className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                            >
                                ログイン
                            </Link>
                        </nav>

                        {/* モバイルメニューボタン */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* モバイルメニュー */}
                    {mobileMenuOpen && (
                        <div className="border-t border-gray-200 py-4 md:hidden">
                            <div className="flex flex-col space-y-4">
                                <Link
                                    href="/"
                                    className="text-gray-700 hover:text-indigo-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ホーム
                                </Link>
                                <Link
                                    href={route('search')}
                                    className="text-gray-700 hover:text-indigo-600"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    検索
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-center text-sm font-medium text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    ログイン
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="min-h-[calc(100vh-16rem)]">{children}</main>

            {/* フッター */}
            <footer className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {/* ブランド */}
                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                                    <span className="text-xl font-bold text-white">TC</span>
                                </div>
                                <span className="text-xl font-bold">Tech Children</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                エンジニア初学者のための技術用語解説サイト
                            </p>
                        </div>

                        {/* リンク */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                サイト内リンク
                            </h3>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="/" className="text-gray-400 hover:text-white">
                                        ホーム
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('search')}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        検索
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        ログイン
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* ソーシャル */}
                        <div>
                            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                Follow Us
                            </h3>
                            <p className="text-sm text-gray-400">
                                最新の技術記事をチェックしよう
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-700 pt-8">
                        <p className="text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} Tech Children. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
