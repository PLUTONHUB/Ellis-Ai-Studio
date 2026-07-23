import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pfxPath = resolve(process.cwd(), env.VITE_HTTPS_PFX_PATH ?? ".certs/ellis-local-dev.pfx");
  const pfxPassphrase = env.VITE_HTTPS_PFX_PASSPHRASE;
  if (command === "serve" && (!existsSync(pfxPath) || !pfxPassphrase)) {
    throw new Error("Local HTTPS is required. Run `npm run setup:https` before starting Vite.");
  }
  return {
  server: {
    port: 3000,
    // A fixed loopback host and strict port prevent a stale process on :3000 from
    // being mistaken for Vite after it silently falls back to another port.
    host: "127.0.0.1",
    strictPort: true,
    https: command === "serve" ? { pfx: readFileSync(pfxPath), passphrase: pfxPassphrase } : undefined,
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
};
});
