import NextHead from "next/head";
import { metadata } from "@/config/meta";

export const Head = () => (
  <NextHead>
    <meta charSet="utf-8" />
    {/* HTML Meta Tags */}
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    <link rel="icon" href="/favicon.ico" />
    <link rel="author" href={metadata.author.url} />
    <meta name="author" content={metadata.author.name} />
    <meta name="creator" content={metadata.creator} />
    <meta name="keywords" content={metadata.keywords.join(",")} />
    <meta
      name="theme-color"
      media="(prefers-color-scheme: light)"
      content="white"
    />
    <meta
      name="theme-color"
      media="(prefers-color-scheme: dark)"
      content="black"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Open Graph / Facebook */}
    <meta property="og:title" content={metadata.title} />
    <meta property="og:description" content={metadata.description} />
    <meta property="og:url" content={metadata.url} />
    <meta property="og:site_name" content={metadata.siteName} />
    <meta property="og:locale" content="en_UK" />
    <meta property="og:image" content={metadata.image} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={metadata.title} />
    <meta property="og:type" content="website" />

    {/* Open Graph / Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={metadata.title} />
    <meta name="twitter:description" content={metadata.description} />
    <meta name="twitter:image" content={metadata.image} />
  </NextHead>
);
