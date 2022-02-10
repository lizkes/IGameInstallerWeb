import { ReactNode, FC } from "react";
import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";

type Props = {
  children: ReactNode;
  variant?: "default" | "center";
  maxWidth?: number;
};

const BasePage: FC<Props> = ({ children, variant = "default", maxWidth }) => {
  const theme = useTheme();

  if (variant === "default") {
    return (
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Container
          sx={{
            maxWidth: maxWidth ?? theme.breakpoints.values.desktop,
            padding: "8px 16px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Container>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Container
          sx={{
            maxWidth: maxWidth ?? theme.breakpoints.values.desktop,
            padding: "8px 16px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {children}
        </Container>
      </Box>
    );
  }
};

export default BasePage;
