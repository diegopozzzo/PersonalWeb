export default function Head() {
  return (
    <>
      {/* Fonts (swap) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&family=Syne:wght@600;700;800&display=swap"
      />

      {/* Social preview */}
      <meta property="og:image" content="/og.webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}

