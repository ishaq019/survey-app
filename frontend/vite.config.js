import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/survey-app/" : "/",
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
  },
}));