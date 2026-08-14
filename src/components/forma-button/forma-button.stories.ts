import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

import type {
  FormaButtonAnimation,
  FormaButtonType,
  FormaButtonVariant,
} from './forma-button';

type ButtonArgs = {
  label: string;
  disabled: boolean;
  variant: FormaButtonVariant;
  color?: string;
  textColor?: string;
  animation?: FormaButtonAnimation;
  type: FormaButtonType;
  name?: string;
  value?: string;
  ariaLabel: string | null;
};

const meta = {
  title: 'Internal/Button examples',
  component: 'forma-button',
  tags: ['!autodocs', 'internal-doc-example'],
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Save changes',
    disabled: false,
    variant: 'simple',
    color: undefined,
    textColor: undefined,
    animation: undefined,
    type: 'button',
    name: undefined,
    value: undefined,
    ariaLabel: null,
  },
  argTypes: {
    label: {
      control: 'text',
      table: { category: 'Story content' },
    },
    disabled: {
      control: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
    variant: {
      control: 'select',
      options: ['simple', 'cute', 'outline'],
      table: { defaultValue: { summary: 'simple' } },
    },
    color: {
      control: 'color',
      table: { defaultValue: { summary: 'variant palette' } },
    },
    textColor: {
      control: 'color',
      name: 'textColor / text-color',
      table: { defaultValue: { summary: 'variant or automatic' } },
    },
    animation: {
      control: 'select',
      options: [undefined, 'zoom', 'none'],
      table: { defaultValue: { summary: 'variant default' } },
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      table: { defaultValue: { summary: 'button' } },
    },
    name: {
      control: 'text',
      table: { defaultValue: { summary: 'undefined' } },
    },
    value: {
      control: 'text',
      table: { defaultValue: { summary: 'undefined' } },
    },
    ariaLabel: {
      control: 'text',
      name: 'ariaLabel / aria-label',
      table: { defaultValue: { summary: 'null' } },
    },
  },
  render: (args) => html`
    <forma-button
      animation=${ifDefined(args.animation)}
      aria-label=${ifDefined(args.ariaLabel ?? undefined)}
      color=${ifDefined(args.color || undefined)}
      ?disabled=${args.disabled}
      name=${ifDefined(args.name || undefined)}
      text-color=${ifDefined(args.textColor || undefined)}
      type=${args.type}
      value=${ifDefined(args.value || undefined)}
      variant=${args.variant}
    >
      ${args.label}
    </forma-button>
  `,
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Provide the simple result used at the start of the documentation page.
export const Primary: Story = {};

// Present the three visual variants and their default animation behavior.
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
      <forma-button variant="simple">Simple</forma-button>
      <forma-button variant="cute">Cute</forma-button>
      <forma-button variant="cute" animation="none">Cute, no motion</forma-button>
      <forma-button variant="outline">Outline</forma-button>
    </div>
  `,
};

// Show automatic palettes, explicit label colors, and CSS-variable colors.
export const CustomColors: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div
      style="--brand-color: hsl(262 52% 55%); display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;"
    >
      <forma-button color="gold">Automatic contrast</forma-button>
      <forma-button color="gold" text-color="navy">Explicit label</forma-button>
      <forma-button variant="cute" color="var(--brand-color)">Brand color</forma-button>
      <forma-button variant="outline" color="seagreen">Outline color</forma-button>
    </div>
  `,
};

// Demonstrate the inert visual and native disabled state for each variant.
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display: flex; flex-wrap: wrap; gap: 1rem; align-items: center;">
      <forma-button disabled>Simple</forma-button>
      <forma-button disabled variant="cute">Cute</forma-button>
      <forma-button disabled variant="outline">Outline</forma-button>
    </div>
  `,
};

// Exercise native type, name, value, submit, and reset behavior in a real form.
export const FormBehavior: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <form
      @reset=${(event: Event) => {
        const form = event.currentTarget as HTMLFormElement;
        const output = form.querySelector('output');
        if (output) output.textContent = 'Form reset';
      }}
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        const form = event.currentTarget as HTMLFormElement;
        const output = form.querySelector('output');
        const submitter = event.submitter as HTMLButtonElement | null;
        if (output) {
          output.textContent = submitter?.name
            ? `Submitted ${submitter.name}=${submitter.value}`
            : 'Form submitted';
        }
      }}
      style="display: grid; gap: 1rem; min-width: min(24rem, 80vw);"
    >
      <label>
        Project name
        <input name="project" value="Forma" style="display: block; margin-top: 0.35rem; padding: 0.5rem; width: 100%;" />
      </label>
      <div style="display: flex; gap: 0.75rem;">
        <forma-button type="submit" name="action" value="save">Save</forma-button>
        <forma-button type="reset" variant="outline">Reset</forma-button>
      </div>
      <output aria-live="polite">Ready</output>
    </form>
  `,
};

// Demonstrate that the host exposes the native click event without duplication.
export const ClickEvent: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    let clickCount = 0;

    // Update the adjacent status so the example gives immediate visible feedback.
    const handleClick = (event: Event) => {
      clickCount += 1;
      const button = event.currentTarget as HTMLElement;
      const output = button.parentElement?.querySelector('output');

      if (output) {
        output.textContent = `Clicked ${clickCount} ${clickCount === 1 ? 'time' : 'times'}`;
      }
    };

    return html`
      <div style="display: flex; align-items: center; gap: 1rem;">
        <forma-button @click=${handleClick}>Count click</forma-button>
        <output aria-live="polite">Clicked 0 times</output>
      </div>
    `;
  },
};
