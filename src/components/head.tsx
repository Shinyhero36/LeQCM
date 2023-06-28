import NextHead from "next/head";

const metatags = {
  title: "Jumbio: Biological system predictive simulation tool",
  description:
    "A dynamic simulator: the course of several days long cultivations (in batch, fed-batch, chemostat, accelerostat, multi-stage, industrial scale bioreactors) is easily simulated within a few minutes.",
  url: "https://...",
  site_name: "Jumbio",
  keywords: ["Jumbio", "Adenon"],
  image: {
    url: "",
  },
  facebook: {
    image: "",
  },
  twitter: {
    title: "Jumbio: Biological system predictive simulation tool",
    description:
      "A dynamic simulator: the course of several days long cultivations (in batch, fed-batch, chemostat, accelerostat, multi-stage, industrial scale bioreactors) is easily simulated within a few minutes.",
    image: "",
  },
};

export const Head = () => (
  <NextHead>
    <meta charSet="utf-8" />
    <title>{metatags.title}</title>
    <meta name="description" content={metatags.description} />
    <link rel="author" href="https://shadcn.com" />
    {/* {metatags.author && (
      <>
        <meta name="author" content={metatags.author} />
        <meta name="creator" content={metatags.author} />
      </>
    )} */}
    {metatags.keywords && (
      <meta name="keywords" content={metatags.keywords.join(",")} />
    )}
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

    <meta property="og:title" content={metatags.title} />
    <meta property="og:description" content={metatags.description} />
    <meta property="og:url" content={metatags.url} />
    <meta property="og:site_name" content={metatags.site_name} />
    <meta property="og:locale" content="en_UK" />
    {metatags.image && (
      <meta property="og:image" content={metatags.image.url} />
    )}
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content={metatags.title} />
    <meta property="og:type" content="website" />
    {metatags.twitter && (
      <>
        <meta name="twitter:card" content="summary_large_image" />
        {/* {metatags.twitter.creator && (
          <meta name="twitter:creator" content={metatags.twitter.creator} />
        )} */}
        <meta name="twitter:title" content={metatags.twitter.title} />
        <meta
          name="twitter:description"
          content={metatags.twitter.description}
        />
        <meta name="twitter:image" content={metatags.twitter.image} />
      </>
    )}
    <link rel="shortcut icon" href="/favicon-16x16.png" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  </NextHead>
);
