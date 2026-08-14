import { setCustomElementsManifest } from '@storybook/web-components';
import type { Preview } from '@storybook/web-components-vite';

import customElements from '../custom-elements.json';
import { defineCustomElement as defineFormaButton } from '../dist/components/forma-button.js';
import '../dist/css/base.css';
import './docs.css';

// Register the compiled component used by every native Storybook example.
defineFormaButton();

// Use Stencil's standards-based manifest as the component API source of truth.
setCustomElementsManifest(customElements);

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    actions: {
      handles: ['click'],
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      options: {
        light: { name: 'Light', value: '#ffffff' },
        soft: { name: 'Soft gray', value: '#f6f8fb' },
        dark: { name: 'Dark', value: '#172033' },
      },
    },
    controls: {
      expanded: true,
      sort: 'requiredFirst',
    },
    docs: {
      source: {
        language: 'html',
        state: 'open',
      },
    },
    options: {
      storySort: {
        order: ['Forma', 'Guides', 'Components'],
      },
    },
  },
};

export default preview;
