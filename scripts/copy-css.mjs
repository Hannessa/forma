import { copyFile, mkdir } from 'node:fs/promises';

// Copy public CSS without introducing another build dependency.
await mkdir(new URL('../dist/css/', import.meta.url), { recursive: true });
await copyFile(
  new URL('../src/css/base.css', import.meta.url),
  new URL('../dist/css/base.css', import.meta.url),
);

