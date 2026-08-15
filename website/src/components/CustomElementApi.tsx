import customElementsManifest from '../../../custom-elements.json';

type ApiItem = {
  name: string;
  description?: string;
};

type ApiAttribute = ApiItem & {
  default?: string;
  fieldName?: string;
  type?: { text?: string };
};

type CustomElementDeclaration = {
  attributes?: ApiAttribute[];
  cssProperties?: ApiItem[];
  customElement?: boolean;
  slots?: ApiItem[];
  tagName?: string;
};

type ManifestModule = {
  declarations?: CustomElementDeclaration[];
};

type CustomElementsManifest = {
  modules?: ManifestModule[];
};

type CustomElementApiProps = {
  tagName: string;
};

// Convert missing values into a consistent documentation placeholder.
function displayValue(value?: string) {
  return value?.replaceAll('undefined', '').replace(/\s*\|\s*$/, '').trim() || '—';
}

// Render API tables from the manifest generated directly by Stencil.
export default function CustomElementApi({ tagName }: CustomElementApiProps) {
  const manifest = customElementsManifest as CustomElementsManifest;
  const declaration = manifest.modules
    ?.flatMap((module) => module.declarations ?? [])
    .find((item) => item.customElement && item.tagName === tagName);

  // Fail the docs build instead of silently publishing a stale component page.
  if (!declaration) {
    throw new Error(`Custom Elements Manifest does not contain ${tagName}.`);
  }

  return (
    <>
      <h3>Properties</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Property</th><th>Attribute</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            {(declaration.attributes ?? []).map((attribute) => (
              <tr key={attribute.name}>
                <td><code>{attribute.fieldName ?? attribute.name}</code></td>
                <td><code>{attribute.name}</code></td>
                <td><code>{displayValue(attribute.type?.text)}</code></td>
                <td><code>{displayValue(attribute.default)}</code></td>
                <td>{attribute.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Slots</h3>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Slot</th><th>Description</th></tr></thead>
          <tbody>
            {(declaration.slots ?? []).map((slot) => (
              <tr key={slot.name || 'default'}>
                <td><code>{slot.name || 'Default'}</code></td>
                <td>{slot.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>CSS custom properties</h3>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Property</th><th>Description</th></tr></thead>
          <tbody>
            {(declaration.cssProperties ?? []).map((property) => (
              <tr key={property.name}>
                <td><code>{property.name}</code></td>
                <td>{property.description ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
