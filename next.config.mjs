import withBundleAnalyzer from "@next/bundle-analyzer";

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", 
})({
  // Your existing Next.js configuration
  reactStrictMode: true,
  // Other configurations...
});

export default config;
