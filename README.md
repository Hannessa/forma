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
  --forma-color-accent: #1d4ed8;
  --forma-color-accent-hover: #1e40af;
  --forma-button-border-radius: 999px;
}
```

Available button tokens include:

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
| `color` | `color` | `string` | Variant palette |
| `animation` | `animation` | `'zoom' \| 'none'` | Variant default |
| `variant` | `variant` | `'simple' \| 'cute'` | `'simple'` |
| `type` | `type` | `'button' \| 'submit' \| 'reset'` | `'button'` |
| `name` | `name` | `string` | — |
| `value` | `value` | `string` | — |
| `ariaLabel` | `aria-label` | `string \| null` | `null` |

The default slot supplies the visible label. Click handling uses the native `click` event; Forma does not emit a duplicate custom event.

The `simple` variant preserves Forma's neutral button appearance and defaults to no movement. The `cute` variant defaults to a rounded pink palette and the `zoom` hover and press animation. Set `animation="none"` to disable movement while retaining the variant's color, highlight, and shadow transitions.

The optional `color` property accepts solid CSS colors such as names, hex, RGB(A), HSL(A), modern color functions, and CSS variables. Each variant derives its own gradient, border, focus, and interaction colors from the supplied base, then chooses black or white label text for contrast. Invalid colors, unresolved variables, and non-solid values use the variant palette instead.

```html
<div style="--brand-color: hsl(262 52% 55%)">
  <forma-button variant="cute" color="var(--brand-color)">Branded button</forma-button>
</div>
```

Existing `--forma-button-*` CSS tokens take precedence over property-derived colors. A CSS-variable color updates the CSS-derived palette when its variable changes, but the calculated label contrast refreshes only when `color` or `variant` changes. Applications that change the variable independently can set `--forma-button-color` alongside it for immediate label-color control.

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
```

`src/react/generated`, `src/vue/generated`, `dist`, and `loader` are generated by the build and are not committed.

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
