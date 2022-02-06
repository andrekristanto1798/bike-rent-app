import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";

import { CurrentUserProvider } from "@/hooks/useCurrentUser";
import { EnumTypesProvider } from "@/hooks/useEnumTypes";
import { BikeProvider } from "@/hooks/useBike";
import createEmotionCache from "@/utils/createEmotionCache";
import initAuth from "@/utils/initAuth";
import theme from "@/utils/theme";

import "@/styles/globals.css";

initAuth();

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function App(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <CurrentUserProvider user={pageProps.user}>
          <EnumTypesProvider>
            <BikeProvider initialBikes={pageProps.bikes}>
              <Component {...pageProps} />
            </BikeProvider>
          </EnumTypesProvider>
        </CurrentUserProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
