import { Head } from '@inertiajs/react';

export default function SEO({
    title = 'Tech Children',
    description = 'エンジニア初学者のための技術用語解説サイト。Git、Docker、Laravel、Reactなどの技術用語をわかりやすく解説します。',
    keywords = '技術用語,プログラミング,初心者,エンジニア,Git,Docker,Laravel,React',
    ogType = 'website',
    ogImage = '/images/og-image.png',
    twitterCard = 'summary_large_image',
    canonical,
    noindex = false,
}) {
    const fullTitle = title === 'Tech Children' ? title : `${title} | Tech Children`;
    const url = canonical || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Head>
            {/* 基本メタタグ */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            {noindex && <meta name="robots" content="noindex,nofollow" />}

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* OGP (Open Graph Protocol) */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Tech Children" />
            <meta property="og:locale" content="ja_JP" />

            {/* Twitter Card */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* その他のメタタグ */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="format-detection" content="telephone=no" />
        </Head>
    );
}
