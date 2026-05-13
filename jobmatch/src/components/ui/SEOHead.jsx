import { Helmet } from 'react-helmet-async'
import { SEO } from '../../seo/meta'

export function SEOHead({ page = 'default' }) {
  const meta = { ...SEO.default, ...SEO[page] }
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords || SEO.default.keywords} />
      <meta name="robots" content={meta.robots || 'index, follow'} />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={meta.ogImage || SEO.default.ogImage} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:site_name" content="JobMatch" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage || SEO.default.ogImage} />

      <link rel="canonical" href={url} />
    </Helmet>
  )
}
