import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,

  sassOptions: {
    loadPaths: [path.join(process.cwd(), "src/assets/scss")],
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              // svgo по умолчанию удаляет viewBox, если он совпадает с width/height (иконки Boxicons 24×24) —
              // тогда иконка, выведенная в другом размере (14, 16, 22 px), обрезается, а не масштабируется.
              // prefixIds — как в конфиге SVGR по умолчанию (уникальные id внутри SVG, напр. у card-qr)
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: { overrides: { removeViewBox: false } },
                  },
                  "prefixIds",
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
