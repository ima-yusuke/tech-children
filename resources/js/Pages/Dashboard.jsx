import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    FolderTree,
    Tags,
    MessageSquare,
    TrendingUp,
    Users,
    Eye,
    Heart,
    BarChart3,
    ArrowUpRight,
    Clock,
    Sparkles
} from 'lucide-react';

export default function Dashboard() {
    const stats = [
        {
            label: '記事数',
            value: '128',
            change: '+12%',
            trend: 'up',
            icon: FileText,
            color: 'from-indigo-600 to-purple-600'
        },
        {
            label: '総閲覧数',
            value: '24.5K',
            change: '+18%',
            trend: 'up',
            icon: Eye,
            color: 'from-blue-600 to-cyan-600'
        },
        {
            label: 'いいね',
            value: '3,247',
            change: '+23%',
            trend: 'up',
            icon: Heart,
            color: 'from-rose-600 to-pink-600'
        },
        {
            label: 'コメント',
            value: '892',
            change: '+8%',
            trend: 'up',
            icon: MessageSquare,
            color: 'from-amber-600 to-orange-600'
        },
    ];

    const menuItems = [
        {
            title: '記事管理',
            description: '記事の作成・編集・削除',
            icon: FileText,
            href: '/admin/posts',
            gradient: 'from-indigo-600 to-purple-600',
            iconBg: 'bg-indigo-500/10',
            iconColor: 'text-indigo-600'
        },
        {
            title: 'カテゴリ管理',
            description: 'カテゴリの管理',
            icon: FolderTree,
            href: '/admin/categories',
            gradient: 'from-blue-600 to-cyan-600',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-600'
        },
        {
            title: 'タグ管理',
            description: 'タグの管理',
            icon: Tags,
            href: '/admin/tags',
            gradient: 'from-emerald-600 to-teal-600',
            iconBg: 'bg-emerald-500/10',
            iconColor: 'text-emerald-600'
        },
        {
            title: 'コメント管理',
            description: 'コメントの承認・削除',
            icon: MessageSquare,
            href: '/admin/comments',
            gradient: 'from-amber-600 to-orange-600',
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-600'
        },
    ];

    const recentActivities = [
        { type: 'post', title: '新しい記事を公開しました', time: '2時間前', color: 'text-indigo-600' },
        { type: 'comment', title: 'コメントが承認されました', time: '4時間前', color: 'text-blue-600' },
        { type: 'category', title: 'カテゴリを追加しました', time: '6時間前', color: 'text-emerald-600' },
        { type: 'post', title: '記事を編集しました', time: '8時間前', color: 'text-purple-600' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                ダッシュボード
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                管理画面へようこそ
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date().toLocaleDateString('ja-JP', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
                <div className="py-8 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-7xl space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5">
                                        <stat.icon className="w-full h-full" />
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                                                <stat.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                                                <TrendingUp className="w-3 h-3" />
                                                {stat.change}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">
                                                {stat.label}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all duration-300"></div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Menu Cards */}
                            <div className="lg:col-span-2">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        管理メニュー
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        各種管理機能へのクイックアクセス
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {menuItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.href}
                                            className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Background Gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                            {/* Decorative circle */}
                                            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                            <div className="relative">
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className={`p-4 rounded-2xl ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                                        <item.icon className={`w-8 h-8 ${item.iconColor}`} />
                                                    </div>
                                                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                                                </div>

                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent group-hover:via-gray-300 transition-all duration-300"></div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        最近のアクティビティ
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        最新の更新情報
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="divide-y divide-gray-100">
                                        {recentActivities.map((activity, index) => (
                                            <div
                                                key={index}
                                                className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${
                                                        activity.type === 'post' ? 'from-indigo-500/10 to-purple-500/10' :
                                                        activity.type === 'comment' ? 'from-blue-500/10 to-cyan-500/10' :
                                                        activity.type === 'category' ? 'from-emerald-500/10 to-teal-500/10' :
                                                        'from-purple-500/10 to-pink-500/10'
                                                    } group-hover:scale-110 transition-transform duration-300`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            activity.type === 'post' ? 'bg-indigo-600' :
                                                            activity.type === 'comment' ? 'bg-blue-600' :
                                                            activity.type === 'category' ? 'bg-emerald-600' :
                                                            'bg-purple-600'
                                                        }`}></div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                                                            {activity.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {activity.time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Analytics */}
                                <div className="mt-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 rounded-xl bg-white/10">
                                                <BarChart3 className="w-6 h-6 text-white" />
                                            </div>
                                            <h4 className="text-lg font-bold text-white">
                                                今月の成長率
                                            </h4>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-white/80">記事投稿</span>
                                                    <span className="text-sm font-bold text-white">89%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" style={{ width: '89%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-white/80">エンゲージメント</span>
                                                    <span className="text-sm font-bold text-white">76%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" style={{ width: '76%' }}></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-white/80">読者数</span>
                                                    <span className="text-sm font-bold text-white">92%</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: '92%' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
