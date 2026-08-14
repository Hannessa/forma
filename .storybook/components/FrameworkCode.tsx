import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { Source } from '@storybook/addon-docs/blocks';

type FrameworkCodeProps = {
  webComponent: string;
  react: string;
  vue: string;
};

const frameworks = [
  { key: 'react', label: 'React', language: 'tsx' },
  { key: 'vue', label: 'Vue', language: 'html' },
  { key: 'webComponent', label: 'Web Component', language: 'html' },
] as const;

// Render reusable, keyboard-accessible framework syntax tabs in MDX pages.
export function FrameworkCode(props: FrameworkCodeProps) {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Select and focus a tab when keyboard navigation changes the active syntax.
  const activateTab = (index: number) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  // Follow the WAI-ARIA tab keyboard pattern for arrows, Home, and End.
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let nextIndex = activeIndex;

    if (event.key === 'ArrowRight') {
      nextIndex = (activeIndex + 1) % frameworks.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (activeIndex - 1 + frameworks.length) % frameworks.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = frameworks.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateTab(nextIndex);
  };

  return (
    <div className="framework-code">
      <div aria-label="Framework syntax" className="framework-code__tabs" role="tablist">
        {frameworks.map((framework, index) => (
          <button
            aria-controls={`${id}-${framework.key}-panel`}
            aria-selected={activeIndex === index}
            className="framework-code__tab"
            id={`${id}-${framework.key}-tab`}
            key={framework.key}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            role="tab"
            tabIndex={activeIndex === index ? 0 : -1}
            type="button"
          >
            {framework.label}
          </button>
        ))}
      </div>

      {frameworks.map((framework, index) => (
        <div
          aria-labelledby={`${id}-${framework.key}-tab`}
          className="framework-code__panel"
          hidden={activeIndex !== index}
          id={`${id}-${framework.key}-panel`}
          key={framework.key}
          role="tabpanel"
          tabIndex={0}
        >
          <Source code={props[framework.key].trim()} language={framework.language} />
        </div>
      ))}
    </div>
  );
}
