import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import ModalProvider from "mui-modal-provider";
import { SnackbarProvider } from "notistack";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import "@fontsource/roboto/400.css";
import "@fontsource/noto-sans-sc/chinese-simplified-300.css";
import "@fontsource/noto-sans-sc/chinese-simplified-400.css";

import theme from "./theme";
import queryClient from "./queryClient";
import store from "./store";
import Router from "./Router";

const App: FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
              styles={{
                "input::-ms-reveal, input::-ms-clear": {
                  display: "none",
                },
              }}
            />
            <BrowserRouter>
              <SnackbarProvider
                preventDuplicate
                maxSnack={3}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <ModalProvider>
                  <Router />
                </ModalProvider>
              </SnackbarProvider>
            </BrowserRouter>
          </ThemeProvider>
        </StyledEngineProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;
