import type { Config } from '@docusaurus/types';
import type { Preset } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Forma',
  tagline: 'Framework-agnostic UI components for the modern web',
  favicon: 'img/favicon.svg',
  url: 'https://hannessa.github.io',
  baseUrl: '/forma/',
  organizationName: 'Hannessa',
  projectName: 'forma',
  trailingSlash: true,
  onBrokenLinks: 'throw',

  // Use the stable modern compiler without opting into unrelated v4 behavior.
  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      mdxCrossCompilerCache: true,
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  clientModules: ['./src/clientModules/registerForma.ts'],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Forma',
      items: [
        { to: '/docs/', label: 'Docs', position: 'left' },
        { to: '/docs/components/button', label: 'Components', position: 'left' },
        {
          href: 'https://github.com/Hannessa/forma',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Overview', to: '/docs/' },
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'Theming', to: '/docs/theming' },
          ],
        },
        {
          title: 'Components',
          items: [{ label: 'Button', to: '/docs/components/button' }],
        },
        {
          title: 'Project',
          items: [{ label: 'GitHub', href: 'https://github.com/Hannessa/forma' }],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Forma.`,
    },
    prism: {
      additionalLanguages: ['bash', 'css', 'markup', 'tsx'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
