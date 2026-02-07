<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TopPageController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\CommentController as AdminCommentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// フロントエンドルート（公開）
Route::get('/', [TopPageController::class, 'index'])->name('home');

// 記事
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{slug}', [PostController::class, 'show'])->name('posts.show');
Route::post('/posts/{post}/comments', [PostController::class, 'storeComment'])->name('posts.comments.store');
Route::post('/posts/{post}/reactions', [PostController::class, 'toggleReaction'])->name('posts.reactions.toggle');
Route::post('/posts/{post}/bookmarks', [PostController::class, 'toggleBookmark'])->name('posts.bookmarks.toggle');

// カテゴリ
Route::get('/categories/{slug}', [CategoryController::class, 'show'])->name('categories.show');

// タグ
Route::get('/tags/{slug}', [TagController::class, 'show'])->name('tags.show');

// 検索
Route::get('/search', [SearchController::class, 'index'])->name('search');

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// 管理画面ルート（認証必須）
Route::prefix('admin')->middleware(['auth', 'verified'])->name('admin.')->group(function () {
    // 記事管理
    Route::resource('posts', AdminPostController::class);
    Route::post('posts/generate', [AdminPostController::class, 'generateArticle'])->name('posts.generate');

    // カテゴリ管理
    Route::resource('categories', AdminCategoryController::class)->except(['show']);

    // タグ管理
    Route::resource('tags', AdminTagController::class)->except(['show']);

    // コメント管理
    Route::resource('comments', AdminCommentController::class)->only(['index', 'show', 'update', 'destroy']);
});

require __DIR__.'/auth.php';
