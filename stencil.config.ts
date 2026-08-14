import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

// Preserve separately compiled framework wrappers while Stencil watches.
const isWatchBuild = process.argv.includes('--watch');

export const config: Config = {
  namespace: 'forma',
  sourceMap: true,
  // Ignore generated source and metadata files to prevent watch loops.
  watchIgnoredRegex: [
    /custom-elements\.json$/,
    /src[\\/]react[\\/]generated[\\/]/,
    /src[\\/]vue[\\/]generated[\\/]/,
  ],
  outputTargets: [
    // Build the lazy loader used by the aggregate registration entry.
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      empty: !isWatchBuild,
    },
    // Build one custom-element module per component for framework wrappers.
    {
      type: 'dist-custom-elements',
      externalRuntime: false,
      generateTypeDeclarations: true,
      empty: !isWatchBuild,
    },
    // Generate the standards-based metadata consumed by Storybook Autodocs.
    {
      type: 'docs-custom-elements-manifest',
      file: 'custom-elements.json',
      strict: true,
    },
    // Generate Vue wrappers that register their custom elements on import.
    vueOutputTarget({
      componentCorePackage: 'forma',
      proxiesFile: 'src/vue/generated/components.ts',
      includeImportCustomElements: true,
      includeDefineCustomElements: false,
      includePolyfills: false,
    }),
    // Generate React wrappers for every Stencil component.
    reactOutputTarget({
      customElementsDir: 'components',
      outDir: 'src/react/generated',
      stencilPackageName: 'forma',
    }),
  ],
};
