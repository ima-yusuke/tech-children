<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'status',
        'published_at',
        'view_count',
        'featured_image',
        'meta_data',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'meta_data' => 'array',
    ];

    /**
     * 記事の投稿者
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 記事のカテゴリ
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * 記事に関連するタグ（多対多）
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    /**
     * 記事の編集履歴
     */
    public function revisions()
    {
        return $this->hasMany(PostRevision::class);
    }

    /**
     * 記事へのコメント
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * 記事へのリアクション（ポリモーフィック）
     */
    public function reactions()
    {
        return $this->morphMany(Reaction::class, 'reactable');
    }

    /**
     * 記事をブックマークしたユーザー
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }
}
