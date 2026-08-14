import type { StorybookConfig } from '@storybook/web-components-vite';
import { mergeConfig } from 'vite';

// Keep the documentation build portable across local and GitHub Pages paths.
const config: StorybookConfig = {
  stories: [
    '../docs/**/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  core: {
    disableWhatsNewNotifications: true,
  },
  features: {
    menuOnboardingChecklist: false,
    sidebarOnboardingChecklist: false,
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      base: './',
    });
  },
};

export default config;
