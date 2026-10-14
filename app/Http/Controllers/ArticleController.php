<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display the specified article.
     */
    public function show(string $slug)
    {
        $article = Article::where('slug', $slug)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        return Inertia::render('ArticleShow', [
            'article' => $article,
        ]);
    }
}
