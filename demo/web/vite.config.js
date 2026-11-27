import { defineConfig } from "vite";
export default defineConfig({
  server: { proxy: { "/agent": { target: "http://127.0.0.1:18082", rewrite: path => path.replace(/^\/agent/, "") } } },
});
