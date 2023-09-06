import solid from "solid-start/vite";
import { defineConfig } from "vite";
import cloudflare from "solid-start-cloudflare-workers";
import hypergoodCss from "@hypergood/css/vite";
import { styleConfig } from "./src/hypergood.config";

export default defineConfig({
  plugins: [
    hypergoodCss({
      config: styleConfig,
    }),
    solid({
      adapter: cloudflare({}),
    }),
  ],
});
