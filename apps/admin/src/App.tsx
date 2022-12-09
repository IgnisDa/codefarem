import { MantineProvider, Text } from '@mantine/core';

// eslint-disable-next-line import/no-default-export
export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Text>Welcome to Mantine!</Text>
    </MantineProvider>
  );
}
