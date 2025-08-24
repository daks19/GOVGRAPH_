import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Optional runtime error overlay plugin (ensure it's installed)

// Attempt to load a local cartographer plugin if present without using top-level await
function loadCartographer() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./vite-plugin-cartographer");
    if (mod?.cartographer) return mod.cartographer();
  } catch {
    // silently ignore if not found
  }
  return null;
}

const cartographerPlugin =
  process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
    ? loadCartographer()
    : null;

export default defineConfig(() => {
  return {
  plugins: [react(), ...(cartographerPlugin ? [cartographerPlugin] : [])],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
