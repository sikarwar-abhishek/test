// import favicon from '@/../public/assets/favicon.webp';
// import Logo from "@/../public/assets/logo.webp";



//example SEO prop

// const SEOdata = {
//     title: "title | whatbytes",
//     description: "whatbytes: description.",
//     image: image.src,
//     keywords: "keyword1, keyword2, keyword3,...",
//     url: "https://www.whatbytes.com"
//   };

export default function SEO({ props }) {

  const author = "WhatBytes Team";
  const publisher = "WhatBytes";
  const siteName = "WhatBytes";
  const twitterHandle = "@WhatBytes";
  const themeColor = "#ffffff";
  const manifestUrl = "/site.webmanifest";
  
  const image = props.image && props.image.trim() !== "" ? props.image : Logo.src

  return (
    <>
      {/* ✅ Primary SEO Meta Tags */}
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta name="keywords" content={props.keywords} />
      <meta name="author" content={author} />
      <meta name="publisher" content={publisher} />
      <link rel="canonical" href={props.url} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="referrer" content="no-referrer-when-downgrade" />
      <meta name="application-name" content={siteName} />
      <meta name="generator" content="Next.js" />
      <meta name="category" content="Technology" />
      {/* <meta name="classification" content="Business, Security, Identity Management" />*/}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* ✅ Open Graph / Facebook */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:url" content={props.url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="WhatBytes Platform" />

      {/* ✅ Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={props.title} />
      <meta name="twitter:description" content={props.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="WhatBytes Platform" />

      {/* ✅ Search Engine & Webmaster Verification */}
      {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      {/* <meta name="yandex-verification" content="your-yandex-verification-code" />*/}
      {/* <meta name="msvalidate.01" content="your-bing-verification-code" />*/}
      {/* <meta name="baidu-site-verification" content="your-baidu-verification-code" />*/}

      {/* ✅ Mobile & Accessibility */}
      <meta name="format-detection" content="telephone=no, email=no, address=no" />
      <meta name="handheldfriendly" content="true" />
      <meta name="mobileoptimized" content="width" />
      <meta name="theme-color" content={themeColor} />
      <meta name="color-scheme" content="light dark" />

      {/* ✅ Performance & Browser Compatibility */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta httpEquiv="Content-Language" content="en" />
      {/* <meta name="rating" content="General" /> */}
      {/* <meta name="expires" content="never" /> */}
      {/* <meta name="revisit-after" content="7 days" /> */}
      {/* <meta name="distribution" content="global" /> */}

      {/* ✅ Schema Markup (Structured Data) */}
      {/*<script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: props.url,
            logo: props.image,
            sameAs: [
              "https://www.facebook.com/WhatBytes",
              "https://twitter.com/WhatBytes",
              "https://www.linkedin.com/company/WhatBytes",
            ],
          }),
        }}
      />*/}

      {/* ✅ PWA & Icons */}
      {/*<link rel="manifest" href={manifestUrl} />*/}
      <link rel="icon" type="image/png" sizes="16x16" href={favicon.src} />
      <link rel="icon" type="image/png" sizes="32x32" href={favicon.src} />
      <link rel="icon" type="image/png" sizes="96x96" href={favicon.src} />
      <link rel="apple-touch-icon" sizes="180x180" href={favicon.src} />
      <meta name="msapplication-TileColor" content={themeColor} />
      {/* <meta name="msapplication-config" content="/browserconfig.xml" />*/}
    </>
  );
}
