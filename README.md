# Forma

Forma is a framework-agnostic UI library built with Stencil. It ships standards-based Web Components, optional base CSS, and generated Vue and React wrappers from one npm package.

The first component is `forma-button`, exposed as `Button` by the framework wrappers.

## Requirements

- Node.js 20 or newer
- Vue 3 when using `forma/vue`
- React 18 or 19 when using `forma/react`

Vue and React are optional peer dependencies. Applications only need the framework they use.

## Local installation

Install Forma from its local directory in a consuming application:

```sh
npm install ../forma
```

The `prepare` lifecycle builds Forma when it is installed from a local folder. The same package structure can later be published to npm without changing consumer imports.

## Vue

Import the generated Vue wrapper directly. Importing the wrapper also registers its underlying custom element, so no plugin is required.

```vue
<script setup lang="ts">
import { Button } from 'forma/vue';
</script>

<template>
  <Button type="button">Save</Button>
  <Button type="button" variant="cute" color="rebeccapurple">Love it</Button>
  <Button type="button" variant="outline">Learn more</Button>
  <Button type="button" color="gold" text-color="navy">Custom label</Button>
  <Button type="button" variant="cute" animation="none">No bounce</Button>
</template>
```

## React

The React output target generates the equivalent React wrapper.

```tsx
import { Button } from 'forma/react';

export function SaveButton() {
  return (
    <>
      <Button type="button">Save</Button>
      <Button type="button" variant="cute" color="rgb(126, 87, 194)">Love it</Button>
      <Button type="button" variant="outline">Learn more</Button>
      <Button type="button" color="gold" textColor="navy">Custom label</Button>
      <Button type="button" variant="cute" animation="none">No bounce</Button>
    </>
  );
}
```

## Web Components

Register only the button when keeping the application bundle as focused as possible:

```ts
import 'forma/components/button';
```

```html
<forma-button type="button">Save</forma-button>
<forma-button type="button" variant="cute" color="rebeccapurple">Love it</forma-button>
<forma-button type="button" variant="outline">Learn more</forma-button>
<forma-button type="button" color="gold" text-color="navy">Custom label</forma-button>
<forma-button type="button" variant="cute" animation="none">No bounce</forma-button>
```

Alternatively, register every Forma component through the aggregate Stencil loader:

```ts
import { defineCustomElements } from 'forma/components';

defineCustomElements();
```

## Base CSS

Forma components include self-contained styles with fallback values. Import the optional base stylesheet to share Forma's neutral design tokens with an application:

```ts
import 'forma/css/base.css';
```

Tokens can be overridden globally or for a component subtree:

```css
:root {
  --forma-color-primary: #1d4ed8;
  --forma-button-border-radius: 999px;
}
```

Available button tokens include:

- `--forma-color-primary`, the shared `simple` and `outline` base color
- `--forma-button-background`, `--forma-button-background-hover`, and `--forma-button-background-active`
- `--forma-button-color` and `--forma-button-border-color`
- `--forma-button-border-radius` and `--forma-button-focus-color`
- `--forma-button-font-weight`, `--forma-button-gap`, and `--forma-button-min-height`
- `--forma-button-padding-block`, `--forma-button-padding-inline`, and `--forma-button-disabled-opacity`

## Button API

`forma-button` renders a native button in scoped light DOM so keyboard interaction and form submission/reset behavior remain native.

| Property | Attribute | Type | Default |
| --- | --- | --- | --- |
| `disabled` | `disabled` | `boolean` | `false` |
| `color` | `color` | `string` | Variant palette or primary color |
| `textColor` | `text-color` | `string` | Variant or automatic label color |
| `animation` | `animation` | `'zoom' \| 'none'` | Variant default |
| `variant` | `variant` | `'simple' \| 'cute' \| 'outline'` | `'simple'` |
| `type` | `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `name` | `name` | `string` | — |
| `value` | `value` | `string` | — |
| `ariaLabel` | `aria-label` | `string \| null` | `null` |

The default slot supplies the visible label. Click handling uses the native `click` event; Forma does not emit a duplicate custom event.

The `simple` variant is a solid primary button and defaults to no movement. The `outline` variant uses the same primary color for its border and label, keeps a transparent background, and adds subtle color tints on hover and press. The shared `--forma-color-primary` token defaults to the classic Bootstrap primary blue and can be overridden globally or for a component subtree. Legacy `--forma-color-accent`, `--forma-color-accent-hover`, and `--forma-color-accent-active` tokens remain supported as fallbacks.

The `cute` variant retains its rounded pink palette and the `zoom` hover and press animation. Set `animation="none"` to disable movement while retaining the variant's color, highlight, and shadow transitions.

The optional `color` property accepts solid CSS colors such as names, hex, RGB(A), HSL(A), modern color functions, and CSS variables. Each variant derives its gradient, border, focus, and interaction colors from the supplied base. Filled variants favor white label text and switch to black only for very bright colors. The outline label uses the button color by default. Invalid colors, unresolved variables, and non-solid values use the variant palette instead.

Use `textColor` in JavaScript, React, and Vue or `text-color` in HTML to override the label with another solid CSS color. Invalid or unresolved text colors fall back to the variant or automatic label color.

```html
<div style="--brand-color: hsl(262 52% 55%)">
  <forma-button variant="cute" color="var(--brand-color)">Branded button</forma-button>
</div>
```

Existing `--forma-button-*` CSS tokens take precedence over property-derived colors. A CSS-variable color updates the CSS-derived palette when its variable changes, but the calculated label contrast refreshes only when `color`, `textColor`, or `variant` changes. Applications that change the variable independently can set `textColor` or `--forma-button-color` alongside it for immediate label-color control.

TypeScript consumers can import `FormaButtonVariant` and `FormaButtonAnimation` from `forma`.

## Project structure

```text
src/
  components/       Stencil components with their encapsulated styles
    forma-button/
      variants/     Layout, palette, and visual interaction styles
      animations/   Reusable movement and scaling animations
  css/              Shared base CSS and design tokens
  entries/          Framework-agnostic registration entries
  react/            React public barrel and generated wrappers
  vue/              Vue public barrel and generated wrappers
website/             Docusaurus configuration, pages, components, and styling
  docs/               Overview, guides, and component reference pages
  src/                Homepage and reusable documentation UI
```

`src/react/generated`, `src/vue/generated`, `dist`, `loader`,
`custom-elements.json`, `website/.docusaurus`, and `website/build` are generated
and are not committed.

## Documentation

The Forma component catalogue is a Docusaurus site with a branded homepage,
installation and theming guides, and interactive component documentation. The
hosted site is available at [hannessa.github.io/forma](https://hannessa.github.io/forma/),
with documentation under `/forma/docs/`.

Each component has one sidebar page with result-first examples and synchronized
syntax tabs ordered React, Vue, and Web Component. The live examples use the
native Web Component implementation. Stencil generates `custom-elements.json`
during the build so properties, attributes, types, defaults, slots, and CSS
custom properties stay aligned with the component source.

Start the documentation development server after installing dependencies:

```sh
npm run docs
```

This performs a normal Forma build, then runs the Stencil watcher and Docusaurus
together at `http://localhost:3000/forma/`. Generated wrappers and
`custom-elements.json` are excluded from Stencil's watch inputs so documentation
rebuilds do not trigger themselves.

Create the deployable static site with:

```sh
npm run build:docs
```

The result is written to `website/build`. Preview an existing production build
with `npm run serve:docs`. Pushes to `main` deploy `website/build` to GitHub Pages
through `.github/workflows/deploy-docs.yml`.

The initial documentation contains:

- **Homepage**, the Forma product introduction
- **Overview**, the documentation start page
- **Getting Started**, with local installation and framework usage
- **Theming**, with shared and component token reference
- **Button**, with result-first examples, framework-specific code, native event guidance, and generated API documentation

## Development

Install dependencies. The npm `prepare` lifecycle performs the initial build automatically:

```sh
npm install
```

Rebuild after making source changes with:

```sh
npm run build
```

After an initial build, watch Stencil component changes without removing the
compiled Vue, React, registration, or base CSS outputs:

```sh
npm run watch
```

Run a normal build again after adding or removing components so the generated
framework wrappers are compiled with the new component exports.

The build performs these steps in order:

1. Stencil compiles the Web Components and generates Vue and React wrappers.
2. TypeScript compiles the framework barrels and component registration entry.
3. The optional base stylesheet is copied to `dist/css/base.css`.

No server or browser is required to build Forma.
