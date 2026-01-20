import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X, Search, BookOpen, Sparkles } from 'lucide-react';

export default function FrontLayout({ children }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
            {/* ヘッダー */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        {/* ロゴ */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Tech Children
                                </span>
                                <span className="block text-xs text-gray-500 -mt-1">
                                    学びの旅をサポート
                                </span>
                            </div>
                        </Link>

                        {/* デスクトップナビゲーション */}
                        <nav className="hidden md:flex md:items-center md:gap-2">
                            <Link
                                href="/"
                                className="px-4 py-2 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-all flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                ホーム
                            </Link>
                            <Link
                                href={route('search')}
                                className="px-4 py-2 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-all flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                検索
                            </Link>
                            <Link
                                href={route('login')}
                                className="ml-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                            >
                                ログイン
                            </Link>
                        </nav>

                        {/* モバイルメニューボタン */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>

                    {/* モバイルメニュー */}
                    {mobileMenuOpen && (
                        <div className="border-t border-gray-100 py-4 md:hidden animate-in slide-in-from-top-2">
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/"
                                    className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-all flex items-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    ホーム
                                </Link>
                                <Link
                                    href={route('search')}
                                    className="px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100 hover:text-indigo-600 transition-all flex items-center gap-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Search className="w-4 h-4" />
                                    検索
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white font-semibold shadow-lg"
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
            <footer className="mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        {/* ブランド */}
                        <div>
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold">Tech Children</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                エンジニア初学者のための技術用語解説サイト。<br />
                                学びの旅をサポートします。
                            </p>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                                    学習
                                </div>
                                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                                    成長
                                </div>
                            </div>
                        </div>

                        {/* リンク */}
                        <div>
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-300">
                                サイトマップ
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        ホーム
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('search')}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        記事を検索
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        ログイン
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* コンタクト */}
                        <div>
                            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-300">
                                つながる
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                最新の技術記事や学習コンテンツを定期的にお届けします。
                            </p>
                            <div className="flex gap-3">
                                <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-purple-400 rounded"></div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded"></div>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                                    <div className="w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-400 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-700/50">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} Tech Children. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-xs text-gray-500">
                                <a href="#" className="hover:text-gray-300 transition-colors">プライバシーポリシー</a>
                                <a href="#" className="hover:text-gray-300 transition-colors">利用規約</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
