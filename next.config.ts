import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {
  /* config options here */
};

if (process.env.NODE_ENV === "development") {
  // Convert to an immediately-invoked async function to allow using await
  (async () => {
    await setupDevPlatform();
  })();
}

export default nextConfig;
