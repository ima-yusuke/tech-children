<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostRevision extends Model
{
    protected $fillable = [
        'post_id',
        'user_id',
        'title',
        'content',
        'excerpt',
        'change_summary',
    ];

    /**
     * リビジョンが属する記事
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * リビジョンを作成したユーザー
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
