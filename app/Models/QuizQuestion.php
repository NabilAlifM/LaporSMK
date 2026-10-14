<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = ['question', 'options', 'answer', 'is_active'];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];
}
