import withBundleAnalyzer from "@next/bundle-analyzer";

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  // Your existing Next.js configuration
  reactStrictMode: true,
  images: {
    domains: ["your-bucket.s3.amazonaws.com", "d14n9lrxk2hjyc.cloudfront.net"],
  },
  // Other configurations...
});

export default config;
