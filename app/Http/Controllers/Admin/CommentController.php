<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    /**
     * コメント一覧の表示
     */
    public function index(Request $request)
    {
        $query = Comment::with(['post', 'user'])
            ->whereNull('parent_id'); // 親コメントのみ取得

        // ステータスでフィルター
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $comments = $query->latest()->paginate(20);

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'filters' => $request->only(['status']),
        ]);
    }

    /**
     * コメント詳細の表示
     */
    public function show(Comment $comment)
    {
        $comment->load(['post', 'user', 'replies.user']);

        return Inertia::render('Admin/Comments/Show', [
            'comment' => $comment,
        ]);
    }

    /**
     * コメントの承認状態を更新
     */
    public function update(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,spam',
        ]);

        $comment->update($validated);

        return back()->with('success', 'コメントのステータスを更新しました。');
    }

    /**
     * コメントの削除
     */
    public function destroy(Comment $comment)
    {
        $comment->delete();

        return redirect()->route('admin.comments.index')
            ->with('success', 'コメントを削除しました。');
    }
}
