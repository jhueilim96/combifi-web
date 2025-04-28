import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://penny-wise-public.894f30bd40cf3066404216f1c45afeab.r2.cloudflarestorage.com/**'), new URL('https://assets.example.com/account456/**')],
  },
};

if (process.env.NODE_ENV === "development") {
  // Convert to an immediately-invoked async function to allow using await
  (async () => {
    await setupDevPlatform();
  })();
}

export default nextConfig;
