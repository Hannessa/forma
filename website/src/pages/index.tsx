import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

import styles from './index.module.css';

const approaches = [
  ['Web Components', 'Use native custom elements in HTML or any JavaScript application.'],
  ['React', 'Import generated, typed wrappers that register their custom elements automatically.'],
  ['Vue', 'Use generated Vue 3 wrappers without installing a global plugin.'],
];

// Introduce the library before routing readers into the documentation.
export default function Home() {
  return (
    <Layout
      title="Framework-agnostic UI components"
      description="Forma provides standards-based Web Components with React and Vue wrappers."
    >
      <main>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Framework-agnostic UI</p>
            <h1 className={styles.title}>One component library.<br />Every modern app.</h1>
            <p className={styles.subtitle}>
              Standards-based Web Components with generated React and Vue wrappers,
              shared design tokens, and one consistent API.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/">
                Get started
              </Link>
              <Link className="button button--secondary button--lg" to="/docs/components/button">
                Explore components
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.approaches}>
          <div className="container">
            <div className={styles.grid}>
              {approaches.map(([title, description]) => (
                <article className={styles.card} key={title}>
                  <h2>{title}</h2>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
