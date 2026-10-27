import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Pin the Nitro deploy target so `vite build` emits Vercel's Build Output API
  // (`.vercel/output`). Lovable's own sandbox still overrides this to Cloudflare.
  nitro: { preset: "vercel" },
  vite: {
    // Serve the app at the domain root. Asset URLs follow this base.
    base: "/",
    server: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
    preview: {
      allowedHosts: ["localhost", "127.0.0.1"],
    },
  },
});
