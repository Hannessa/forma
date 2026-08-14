import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// Give the component catalogue a restrained Forma-branded presentation.
addons.setConfig({
  // Keep supporting Canvas stories out of the public documentation navigation.
  sidebar: {
    filters: {
      publicDocumentation: (item) => !item.tags.includes('internal-doc-example'),
    },
  },
  theme: create({
    base: 'light',
    brandTitle: 'Forma',
    brandUrl: '?path=/docs/forma-overview--docs',
    brandTarget: '_self',
    colorPrimary: '#0d6efd',
    colorSecondary: '#f765ac',
    appBg: '#f6f8fb',
    appContentBg: '#ffffff',
    appBorderColor: '#dfe4ec',
    appBorderRadius: 8,
    barBg: '#ffffff',
    inputBg: '#ffffff',
    inputBorder: '#c7cfdb',
    inputBorderRadius: 6,
    textColor: '#172033',
    textMutedColor: '#647084',
  }),
});
