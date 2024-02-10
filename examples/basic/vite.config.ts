import { defineConfig } from "@solidjs/start/config";
import hypergoodCss from "@hypergood/css/vite";
import { styleConfig } from "./src/hypergood.config";
import PluginInspect from "@vinxi/vite-plugin-inspect";

export default defineConfig({
  plugins: [
    hypergoodCss({
      config: styleConfig,
    }),
    PluginInspect(),
  ],
});
