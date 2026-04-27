import type { NextConfig } from "next";

const apiUpstream = process.env.API_UPSTREAM?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /**
   * Vercel (edge) → proxy `/api/*` to the Railway-hosted Next server when
   * `API_UPSTREAM` is set (e.g. https://your-service.up.railway.app).
   * Leave unset on Railway and locally so `/api` is served by this app.
   */
  async rewrites() {
    if (!apiUpstream) return [];
    return [{ source: "/api/:path*", destination: `${apiUpstream}/api/:path*` }];
  },
};

export default nextConfig;
