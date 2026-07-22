import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
    // A fixed loopback host and strict port prevent a stale process on :3000 from
    // being mistaken for Vite after it silently falls back to another port.
    host: "127.0.0.1",
    strictPort: true,
    headers: {
      "Cache-Control": "no-store",
    },
    forwardConsole: {
      unhandledErrors: true,
      logLevels: ["warn", "error"],
    },
  },
  plugins: [
    // Miniflare is only needed when producing the Cloudflare deployment bundle.
    // Local development uses Vite's regular Node runtime, avoiding workerd startup.
    ...(command === "build" ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart(),
    viteReact(),
  ],
}));
