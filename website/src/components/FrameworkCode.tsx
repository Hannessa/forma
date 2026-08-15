import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';

type FrameworkCodeProps = {
  react: string;
  vue: string;
  webComponent: string;
};

// Keep the selected framework synchronized across every example on the page.
export default function FrameworkCode(props: FrameworkCodeProps) {
  return (
    <Tabs groupId="framework" queryString="framework">
      <TabItem value="react" label="React" default>
        <CodeBlock language="tsx">{props.react.trim()}</CodeBlock>
      </TabItem>
      <TabItem value="vue" label="Vue">
        <CodeBlock language="html">{props.vue.trim()}</CodeBlock>
      </TabItem>
      <TabItem value="web-component" label="Web Component">
        <CodeBlock language="html">{props.webComponent.trim()}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
