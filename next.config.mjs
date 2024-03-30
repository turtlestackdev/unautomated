/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
    ],
  },
  eslint: {
    dirs: ['src'],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: [{
          loader: '@svgr/webpack', options: {
            svgoConfig: {
              plugins: [
                'preset-default',
                'removeDimensions',
                'sortAttrs',
                'cleanupListOfValues',
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: ['fill'],
                  },
                },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [
                      {
                        fill: 'currentColor',
                        'aria-hidden': 'true',
                        'data-slot': 'icon',
                      },
                    ],
                  },
                },
              ],
            },
            replaceAttrValues: { 'primary': '{props.primary}', 'secondary': '{props.secondary}' },
            typescript: true,
            ext: 'tsx',
          },
        }],

      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
