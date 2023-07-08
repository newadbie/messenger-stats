import { env } from "./src/env.mjs";

/* eslint-disable @typescript-eslint/require-await */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${env.SUPABASE_URL}/:path*`,
      },
    ];
  },
};

export default config;
