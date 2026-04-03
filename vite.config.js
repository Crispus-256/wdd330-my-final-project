import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/wdd330-my-final-project/",
  root: "src",
  publicDir: "public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "src/index.html"),
        product: resolve(__dirname, "src/product/index.html"),
        cart: resolve(__dirname, "src/cart/index.html")
      }
    }
  }
});
