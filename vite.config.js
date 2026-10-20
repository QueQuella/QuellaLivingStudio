import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "studio-runtime-reload",
      // The preserved engines have global animation loops. Reload their page on
      // source edits instead of adding duplicate listeners through Fast Refresh.
      handleHotUpdate({ file, server }) {
        if (file.includes("/src/") && !file.includes("/styles/")) {
          server.ws.send({ type: "full-reload" });
          return [];
        }
      },
    },
  ],
  // Relative output works on GitHub project Pages and ordinary static hosting.
  base: "./",
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
  build: { target: "es2022" },
});
