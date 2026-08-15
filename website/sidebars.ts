import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'overview',
    {
      type: 'category',
      label: 'Guides',
      items: ['getting-started', 'theming'],
    },
    {
      type: 'category',
      label: 'Components',
      items: ['components/button'],
    },
  ],
};

export default sidebars;
