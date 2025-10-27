import withBundleAnalyzer from "@next/bundle-analyzer";

const hostnames = [
  "d14n9lrxk2hjyc.cloudfront.net",
  "staging-api.dailyiq.ai"
];
const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  // Your existing Next.js configuration
  reactStrictMode: true,
  images: {
    remotePatterns:  hostnames.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
  },
  // Other configurations...
});

export default config;
