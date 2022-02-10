import { FC, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AppBar, Box } from "@mui/material";

import AccountButton from "./AccountButton";
import Stepper from "./Stepper";
import Title from "./Title";

const Header: FC = () => {
  const location = useLocation();

  const [headerIsShow, isInstalling] = useMemo(() => {
    const page = location.pathname.split("/", 2)[1];
    if (["config", "confirm", "install", "done", "buy"].includes(page)) {
      if (page === "install") {
        return [true, true];
      }
      return [true, false];
    } else {
      return [false, false];
    }
  }, [location.pathname]);

  if (!headerIsShow) {
    return null;
  }

  return (
    <>
      <AppBar
        sx={{
          position: "fixed",
          height: {
            default: "84px",
            large: "56px",
            tablet: "64px",
          },
          padding: {
            default: "0 16px",
            large: "0 24px",
          },
          flexDirection: "column",
          backgroundColor: (t) => t.palette.primary.main,
        }}
      >
        <Box
          sx={{
            height: {
              default: "48px",
              large: "56px",
              tablet: "64px",
            },
            minHeight: "48px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <Stepper />
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          {isInstalling ? null : <AccountButton />}
        </Box>
      </AppBar>
      <Box
        sx={{
          height: {
            default: "84px",
            large: "56px",
            tablet: "64px",
          },
          flexShrink: 0,
        }}
      />
      <Title />
    </>
  );
};

export default Header;
