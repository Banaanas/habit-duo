import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./src/tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.config.{js,ts}",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@/actions": path.resolve(__dirname, "./src/app/actions"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/data": path.resolve(__dirname, "./src/data"),
      "@/features": path.resolve(__dirname, "./src/features"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/public": path.resolve(__dirname, "./public"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/tests": path.resolve(__dirname, "./src/tests"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
