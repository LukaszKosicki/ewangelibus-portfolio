const DEFAULT_SITE_URL = "https://ewangelibus.pl";

function getSiteUrl() {
  const configuredUrl = process.env.NEXT_FRONTEND_URL || DEFAULT_SITE_URL;
  return configuredUrl.endsWith("/") ? configuredUrl.slice(0, -1) : configuredUrl;
}

function toAbsoluteUrl(value) {
  if (!value) {
    return getSiteUrl();
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export default function MetaTags(title, url, image, description, _subject, type) {
  const canonicalUrl = toAbsoluteUrl(url);
  const imageUrl = toAbsoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: type || "website",
      title,
      url: canonicalUrl,
      description,
      siteName: "EwangeliBus.pl",
      locale: "pl_PL",
      images: [
        {
          url: imageUrl,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}