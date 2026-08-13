import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

export type FormaButtonType = 'button' | 'submit' | 'reset';
export type FormaButtonVariant = 'simple' | 'cute';
export type FormaButtonAnimation = 'zoom' | 'none';

// Let each variant select motion without coupling movement to its visual CSS.
const defaultAnimations: Record<FormaButtonVariant, FormaButtonAnimation> = {
  simple: 'none',
  cute: 'zoom',
};

@Component({
  tag: 'forma-button',
  styleUrls: [
    'forma-button.css',
    'variants/simple.css',
    'variants/cute.css',
    'animations/zoom.css',
  ],
  scoped: true,
})
export class FormaButton {
  @Element() host!: HTMLElement;

  // Store validated palette state without changing the public color value.
  @State() private hasCustomColor = false;
  @State() private customLabelColor = '#ffffff';

  // Disable native pointer, keyboard, and form interactions.
  @Prop({ reflect: true }) disabled = false;

  // Use the original neutral appearance unless another variant is selected.
  @Prop({ reflect: true }) variant: FormaButtonVariant = 'simple';

  // Override the variant palette with a solid CSS color.
  @Prop({ reflect: true }) color?: string;

  // Override the motion selected by the active variant.
  @Prop({ reflect: true }) animation?: FormaButtonAnimation;

  // Keep buttons inert by default to avoid accidental form submissions.
  @Prop({ reflect: true }) type: FormaButtonType = 'button';

  // Forward native form submission metadata to the inner button.
  @Prop({ reflect: true }) name?: string;
  @Prop({ reflect: true }) value?: string;

  // Give icon-only buttons an accessible name.
  @Prop({ attribute: 'aria-label' }) ariaLabel: string | null = null;

  // Resolve CSS variables after the component has joined the document.
  componentDidLoad() {
    this.updateCustomColor();
  }

  // Recalculate the palette when its public inputs change.
  @Watch('color')
  @Watch('variant')
  protected handlePaletteChange() {
    this.updateCustomColor();
  }

  // Validate the color and select readable black or white label text.
  private updateCustomColor() {
    const channels = this.resolveColorChannels(this.color);
    const hasCustomColor = channels !== undefined;
    const customLabelColor = channels ? this.getContrastingLabel(channels) : '#ffffff';

    // Avoid unnecessary renders when the derived palette is unchanged.
    if (this.hasCustomColor !== hasCustomColor) {
      this.hasCustomColor = hasCustomColor;
    }

    if (this.customLabelColor !== customLabelColor) {
      this.customLabelColor = customLabelColor;
    }
  }

  // Resolve both literal colors and inherited CSS variables to RGB channels.
  private resolveColorChannels(color?: string): [number, number, number] | undefined {
    if (!color || typeof document === 'undefined' || typeof getComputedStyle === 'undefined') {
      return undefined;
    }

    // Reject gradients and other values that are not valid CSS colors.
    if (typeof CSS !== 'undefined' && !CSS.supports('color', color)) {
      return undefined;
    }

    // Resolve twice to detect missing variables that fall back to inherited color.
    const darkResolution = this.resolveComputedColor(color, 'rgb(1, 2, 3)');
    const lightResolution = this.resolveComputedColor(color, 'rgb(251, 252, 253)');

    if (!darkResolution || darkResolution !== lightResolution) {
      return undefined;
    }

    // Let canvas normalize supported browser color formats to sRGB channels.
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return undefined;
    }

    canvas.width = 1;
    canvas.height = 1;
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = darkResolution;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    return [red, green, blue];
  }

  // Read a candidate color in the host's CSS-variable context.
  private resolveComputedColor(color: string, inheritedColor: string) {
    const container = document.createElement('span');
    const probe = document.createElement('span');

    // Keep the temporary resolver out of layout and accessibility trees.
    container.hidden = true;
    container.style.color = inheritedColor;
    probe.style.color = color;
    container.append(probe);
    this.host.append(container);

    const resolvedColor = getComputedStyle(probe).color;
    container.remove();
    return resolvedColor;
  }

  // Compare black and white using the WCAG relative-luminance formula.
  private getContrastingLabel([red, green, blue]: [number, number, number]) {
    const toLinear = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };

    const luminance =
      0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
    const blackContrast = (luminance + 0.05) / 0.05;
    const whiteContrast = 1.05 / (luminance + 0.05);

    return blackContrast >= whiteContrast ? '#000000' : '#ffffff';
  }

  // Resolve the variant default unless the consumer supplied an override.
  private get effectiveAnimation() {
    return this.animation ?? defaultAnimations[this.variant] ?? 'none';
  }

  // Pass only validated palette values into variant styles.
  private get customPaletteStyle(): { [key: string]: string } | undefined {
    if (!this.hasCustomColor || !this.color) {
      return undefined;
    }

    return {
      '--forma-button-custom-color': this.color,
      '--forma-button-custom-label-color': this.customLabelColor,
    };
  }

  // Render a native control so browser form and keyboard behavior is preserved.
  render() {
    return (
      <button
        aria-label={this.ariaLabel}
        data-animation={this.effectiveAnimation}
        disabled={this.disabled}
        name={this.name}
        style={this.customPaletteStyle}
        type={this.type}
        value={this.value}
      >
        <slot />
      </button>
    );
  }
}
