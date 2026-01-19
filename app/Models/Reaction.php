<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{
    protected $fillable = [
        'reactable_id',
        'reactable_type',
        'user_id',
        'type',
    ];

    /**
     * リアクション対象（記事、コメント等）
     */
    public function reactable()
    {
        return $this->morphTo();
    }

    /**
     * リアクションしたユーザー
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
