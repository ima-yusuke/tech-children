<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'author_name',
        'author_email',
        'content',
        'status',
        'ip_address',
    ];

    /**
     * コメントが投稿された記事
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * コメント投稿者（ログインユーザーの場合）
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 親コメント（返信の場合）
     */
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * 子コメント（返信）
     */
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }

    /**
     * コメントへのリアクション（ポリモーフィック）
     */
    public function reactions()
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }
}
