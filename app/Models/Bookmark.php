<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'note',
    ];

    /**
     * ブックマークしたユーザー
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ブックマークした記事
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
