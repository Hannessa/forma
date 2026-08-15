import { useState, type CSSProperties, type FormEvent } from 'react';

import Demo from './Demo';

// Show the default component before introducing configuration options.
export function PrimaryButtonDemo() {
  return (
    <Demo>
      <forma-button type="button">Save changes</forma-button>
    </Demo>
  );
}

// Compare all visual variants and the optional motion override.
export function ButtonVariantsDemo() {
  return (
    <Demo>
      <forma-button variant="simple">Simple</forma-button>
      <forma-button variant="cute">Cute</forma-button>
      <forma-button variant="cute" animation="none">Cute, no motion</forma-button>
      <forma-button variant="outline">Outline</forma-button>
    </Demo>
  );
}

// Demonstrate automatic contrast, explicit labels, and CSS-variable colors.
export function ButtonColorsDemo() {
  return (
    <Demo>
      <div className="forma-demo__row" style={{ '--brand-color': 'hsl(262 52% 55%)' } as CSSProperties}>
        <forma-button color="gold">Automatic contrast</forma-button>
        <forma-button color="gold" text-color="navy">Explicit label</forma-button>
        <forma-button variant="cute" color="var(--brand-color)">Brand color</forma-button>
        <forma-button variant="outline" color="seagreen">Outline color</forma-button>
      </div>
    </Demo>
  );
}

// Show that every visual variant supports the native disabled state.
export function DisabledButtonsDemo() {
  return (
    <Demo>
      <forma-button disabled>Simple</forma-button>
      <forma-button disabled variant="cute">Cute</forma-button>
      <forma-button disabled variant="outline">Outline</forma-button>
    </Demo>
  );
}

// Exercise native submit and reset behavior inside an actual form.
export function ButtonFormDemo() {
  const [status, setStatus] = useState('Ready');

  // Prevent navigation while reporting which submit control initiated the event.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    setStatus(submitter?.name ? `Submitted ${submitter.name}=${submitter.value}` : 'Form submitted');
  };

  return (
    <Demo>
      <form
        className="forma-demo__form"
        onReset={() => setStatus('Form reset')}
        onSubmit={handleSubmit}
      >
        <label>
          Project name
          <input defaultValue="Forma" name="project" />
        </label>
        <div className="forma-demo__row">
          <forma-button type="submit" name="action" value="save">Save</forma-button>
          <forma-button type="reset" variant="outline">Reset</forma-button>
        </div>
        <output aria-live="polite">{status}</output>
      </form>
    </Demo>
  );
}

// Report native click events without adding a duplicate custom event.
export function ButtonClickDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Demo>
      <forma-button onClick={() => setClickCount((count) => count + 1)}>Count click</forma-button>
      <output aria-live="polite">Clicked {clickCount} {clickCount === 1 ? 'time' : 'times'}</output>
    </Demo>
  );
}

// Demonstrate the accessible-name escape hatch for icon-only content.
export function ButtonAccessibilityDemo() {
  return (
    <Demo>
      <forma-button aria-label="Add to favorites" variant="cute">♥</forma-button>
    </Demo>
  );
}
