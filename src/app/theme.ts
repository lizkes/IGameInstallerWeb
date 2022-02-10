import { createTheme } from "@mui/material/styles";
import { zhCN } from "@mui/material/locale";
import { green } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
    default: true;
    phone: true;
    large: true;
    pad: true;
    tablet: true;
    desktop: true;
  }
}

const theme = createTheme(
  {
    palette: {
      mode: "light",
      // primary: { main: blue[800], light: blue[600] },
      // secondary: { main: purple[500] },
      // error: { main: red[800], light: red[400] },
      success: { light: "#4caf50", main: green[600] },
      // background: { default: "#111111" },
      // info: { main: blue[800], light: blue[600] },
    },
    breakpoints: {
      values: {
        default: 0,
        phone: 360,
        large: 560,
        pad: 760,
        tablet: 1100,
        desktop: 1440,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily:
              "'Roboto', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily:
              "'Roboto', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: "'Roboto', 'Microsoft YaHei', sans-serif",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontFamily:
              "'Roboto', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
          },
        },
      },
    },
  },
  zhCN
);

export default theme;
