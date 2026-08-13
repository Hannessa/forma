import { Component, h, Prop } from '@stencil/core';

export type FormaButtonType = 'button' | 'submit' | 'reset';

@Component({
  tag: 'forma-button',
  styleUrl: '../../css/components/forma-button.css',
  scoped: true,
})
export class FormaButton {
  // Disable native pointer, keyboard, and form interactions.
  @Prop({ reflect: true }) disabled = false;

  // Keep buttons inert by default to avoid accidental form submissions.
  @Prop({ reflect: true }) type: FormaButtonType = 'button';

  // Forward native form submission metadata to the inner button.
  @Prop({ reflect: true }) name?: string;
  @Prop({ reflect: true }) value?: string;

  // Give icon-only buttons an accessible name.
  @Prop({ attribute: 'aria-label' }) ariaLabel: string | null = null;

  // Render a native control so browser form and keyboard behavior is preserved.
  render() {
    return (
      <button
        aria-label={this.ariaLabel}
        disabled={this.disabled}
        name={this.name}
        type={this.type}
        value={this.value}
      >
        <slot />
      </button>
    );
  }
}
