import "@styles/globals.css";
import { MantineProvider } from "@mantine/core";

function Application(props) {
  const { Component, pageProps } = props;

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "dark",
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default Application;
