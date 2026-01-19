<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'order',
    ];

    /**
     * カテゴリに属する記事
     */
    public function posts()
    {
        return $this->hasMany(Post::class);
    }
}
