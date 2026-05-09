import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Sentry options
  silent: true,
  org: "eso-mystic",
  project: "web",
}, {
  // Additional Sentry configuration
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
});
