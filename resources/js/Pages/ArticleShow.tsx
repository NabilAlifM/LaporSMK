import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    published_at: string;
}

interface ArticleShowProps {
    article: Article;
}

export default function ArticleShow({ article }: ArticleShowProps) {
    const formattedDate = new Date(article.published_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased">
            {/* SEO Dynamic Metadata using Inertia <Head> */}
            <Head>
                <title>{article.title} - Komin Blog</title>
                <meta name="description" content={article.excerpt || 'Baca artikel lengkap di platform Komin SMK Bina Informatika.'} />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt || 'Baca artikel lengkap di platform Komin SMK Bina Informatika.'} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Komin SMK Bina Informatika" />
                {article.featured_image && (
                    <meta property="og:image" content={article.featured_image.startsWith('http') ? article.featured_image : `/storage/${article.featured_image}`} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.title} />
                <meta name="twitter:description" content={article.excerpt || ''} />
            </Head>

            {/* Navbar Header */}
            <nav className="sticky top-0 bg-white border-b border-gray-100 z-40">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-[#4BB8FA] font-bold text-xl font-sans tracking-wide">Komin</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-xs text-gray-500 font-medium">SMK Bina Informatika</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 border border-gray-200 text-gray-600 hover:text-[#4BB8FA] hover:border-[#4BB8FA] rounded-xl text-xs font-semibold transition"
                    >
                        Masuk Dashboard
                    </Link>
                </div>
            </nav>

            {/* Article Container */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#4BB8FA] font-semibold mb-8 group transition"
                >
                    <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Kembali ke Halaman Utama
                </Link>

                <article className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100/80">
                    {/* Metadata Header */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <span>🏷️ Info Sekolah</span>
                        <span>•</span>
                        <span>{formattedDate}</span>
                    </div>

                    {/* Article Title */}
                    <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 leading-tight mb-6">
                        {article.title}
                    </h1>

                    {/* Featured Image */}
                    {article.featured_image && (
                        <div className="w-full mb-8 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                            <img
                                src={article.featured_image.startsWith('http') ? article.featured_image : `/storage/${article.featured_image}`}
                                alt={article.title}
                                className="w-full h-auto object-cover max-h-[400px]"
                            />
                        </div>
                    )}

                    {/* Excerpt if exists */}
                    {article.excerpt && (
                        <p className="text-md font-medium text-gray-500 border-l-4 border-[#4BB8FA] pl-4 italic mb-8 leading-relaxed">
                            "{article.excerpt}"
                        </p>
                    )}

                    {/* Article Rich Text Content */}
                    <div 
                        className="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base space-y-6"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </article>
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400 mt-16">
                <p>© 2026 Komin SMK Bina Informatika. All rights reserved.</p>
            </footer>
        </div>
    );
}
