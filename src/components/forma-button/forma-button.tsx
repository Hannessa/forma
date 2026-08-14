import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

export type FormaButtonType = 'button' | 'submit' | 'reset';
export type FormaButtonVariant = 'simple' | 'cute' | 'outline';
export type FormaButtonAnimation = 'zoom' | 'none';

type CustomPalette = {
  color?: string;
  labelColor?: string;
};

// Let each variant select motion without coupling movement to its visual CSS.
const defaultAnimations: Record<FormaButtonVariant, FormaButtonAnimation> = {
  simple: 'none',
  cute: 'zoom',
  outline: 'none',
};

@Component({
  tag: 'forma-button',
  styleUrls: [
    'forma-button.css',
    'variants/simple.css',
    'variants/cute.css',
    'variants/outline.css',
    'animations/zoom.css',
  ],
  scoped: true,
})
export class FormaButton {
  @Element() host!: HTMLElement;

  // Store all validated palette values together so rendering stays atomic.
  @State() private customPalette: CustomPalette = {};

  // Disable native pointer, keyboard, and form interactions.
  @Prop({ reflect: true }) disabled = false;

  // Use the original neutral appearance unless another variant is selected.
  @Prop({ reflect: true }) variant: FormaButtonVariant = 'simple';

  // Override the variant palette with a solid CSS color.
  @Prop({ reflect: true }) color?: string;

  // Override the variant or automatically selected label color.
  @Prop({ attribute: 'text-color', reflect: true }) textColor?: string;

  // Override the motion selected by the active variant.
  @Prop({ reflect: true }) animation?: FormaButtonAnimation;

  // Keep buttons inert by default to avoid accidental form submissions.
  @Prop({ reflect: true }) type: FormaButtonType = 'button';

  // Forward native form submission metadata to the inner button.
  @Prop({ reflect: true }) name?: string;
  @Prop({ reflect: true }) value?: string;

  // Give icon-only buttons an accessible name.
  @Prop({ attribute: 'aria-label' }) ariaLabel: string | null = null;

  // Resolve the initial palette before rendering to avoid a label-color flash.
  componentWillLoad() {
    this.updateCustomColor();
  }

  // Recalculate the palette when its public inputs change.
  @Watch('color')
  @Watch('textColor')
  @Watch('variant')
  protected handlePaletteChange() {
    this.updateCustomColor();
  }

  // Validate both public colors and derive one stable palette update.
  private updateCustomColor() {
    const colorChannels = this.resolveColorChannels(this.color);
    const textColorChannels = this.resolveColorChannels(this.textColor);
    const color = colorChannels ? this.color : undefined;
    let labelColor = textColorChannels ? this.textColor : undefined;

    // Filled variants choose label contrast when no explicit override exists.
    if (!labelColor && colorChannels && this.variant !== 'outline') {
      labelColor = this.getContrastingLabel(colorChannels);
    }

    // Avoid rerendering when neither derived value changed.
    if (
      this.customPalette.color !== color ||
      this.customPalette.labelColor !== labelColor
    ) {
      this.customPalette = { color, labelColor };
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

    let resolvedColor = color;

    // Resolve variables twice to detect missing values that inherit the probe color.
    if (color.includes('var(')) {
      const darkResolution = this.resolveComputedColor(color, 'rgb(1, 2, 3)');
      const lightResolution = this.resolveComputedColor(color, 'rgb(251, 252, 253)');

      if (!darkResolution || darkResolution !== lightResolution) {
        return undefined;
      }

      resolvedColor = darkResolution;
    }

    // Let canvas normalize supported browser color formats to sRGB channels.
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      return undefined;
    }

    context.clearRect(0, 0, 1, 1);
    context.fillStyle = resolvedColor;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
    return [red, green, blue];
  }

  // Read a candidate color in the host's CSS-variable context.
  private resolveComputedColor(color: string, inheritedColor: string) {
    const container = document.createElement('span');
    const probe = document.createElement('span');
    const hostStyle = getComputedStyle(this.host);

    // Keep the resolver invisible without using display:none computed styles.
    container.setAttribute('aria-hidden', 'true');
    container.style.position = 'fixed';
    container.style.visibility = 'hidden';
    container.style.color = inheritedColor;

    // Copy referenced variables so host-scoped color values resolve externally.
    for (const match of color.matchAll(/var\(\s*(--[\w-]+)/g)) {
      const property = match[1];
      const value = hostStyle.getPropertyValue(property);

      if (value) {
        container.style.setProperty(property, value);
      }
    }

    probe.style.color = color;
    container.append(probe);
    document.documentElement.append(container);

    const resolvedColor = getComputedStyle(probe).color;
    container.remove();
    return resolvedColor;
  }

  // Favor white and use black only when the background is genuinely bright.
  private getContrastingLabel([red, green, blue]: [number, number, number]) {
    const toLinear = (channel: number) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };

    const luminance =
      0.2126 * toLinear(red) + 0.7152 * toLinear(green) + 0.0722 * toLinear(blue);
    return luminance >= 0.6 ? '#000000' : '#ffffff';
  }

  // Resolve the variant default unless the consumer supplied an override.
  private get effectiveAnimation() {
    return this.animation ?? defaultAnimations[this.variant] ?? 'none';
  }

  // Apply palette values to the host so projected Vue content inherits them.
  private get customPaletteStyle(): { [key: string]: string } {
    const style: { [key: string]: string } = {};

    // Keep invalid or absent values out of the generated inline styles.
    if (this.customPalette.color) {
      style['--forma-button-custom-color'] = this.customPalette.color;
    }

    if (this.customPalette.labelColor) {
      style['--forma-button-custom-label-color'] = this.customPalette.labelColor;
    }

    // Match the active variant's CSS fallback at the slot-content boundary.
    const labelColor =
      this.variant === 'outline'
        ? 'var(--forma-button-custom-label-color, var(--forma-button-custom-color, var(--forma-button-base-color)))'
        : 'var(--forma-button-custom-label-color, #ffffff)';
    style.color = `var(--forma-button-color, ${labelColor})`;

    return style;
  }

  // Render a native control so browser form and keyboard behavior is preserved.
  render() {
    return (
      <Host style={this.customPaletteStyle}>
        <button
          aria-label={this.ariaLabel}
          data-animation={this.effectiveAnimation}
          disabled={this.disabled}
          name={this.name}
          type={this.type}
          value={this.value}
        >
          <slot />
        </button>
      </Host>
    );
  }
}
