<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * ユーザーが投稿した記事
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    /**
     * ユーザーが編集した記事のリビジョン
     */
    public function postRevisions()
    {
        return $this->hasMany(PostRevision::class);
    }

    /**
     * ユーザーが投稿したコメント
     */
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * ユーザーがつけたリアクション
     */
    public function reactions()
    {
        return $this->hasMany(Reaction::class);
    }

    /**
     * ユーザーのブックマーク
     */
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }
}
