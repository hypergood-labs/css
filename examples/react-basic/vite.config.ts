import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import hypergoodCss from "@hypergood/css/vite";
import { styleConfig } from "./src/hypergood.config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    hypergoodCss({
      config: styleConfig,
    }),
    react(),
  ],
});
