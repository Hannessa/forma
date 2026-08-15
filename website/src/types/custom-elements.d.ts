import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type FormaButtonAttributes = HTMLAttributes<HTMLElement> & {
  animation?: 'zoom' | 'none';
  'aria-label'?: string;
  color?: string;
  disabled?: boolean;
  name?: string;
  'text-color'?: string;
  type?: 'button' | 'submit' | 'reset';
  value?: string;
  variant?: 'simple' | 'cute' | 'outline';
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'forma-button': DetailedHTMLProps<FormaButtonAttributes, HTMLElement>;
    }
  }
}
