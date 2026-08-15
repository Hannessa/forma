import type { ReactNode } from 'react';

type DemoProps = {
  children: ReactNode;
};

// Present live examples consistently without coupling them to a component explorer.
export default function Demo({ children }: DemoProps) {
  return <div className="forma-demo">{children}</div>;
}
