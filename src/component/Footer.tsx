import { FC, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Typography, Container, Link, Divider, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import WebSendMessage from "@/model/WebSendMessage";

const Footer: FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const show = useMemo(() => {
    const page = location.pathname.split("/", 2)[1];
    if (
      [
        "config",
        "confirm",
        "install",
        "done",
        "buy",
        "login",
        "register",
        "forget",
      ].includes(page)
    ) {
      return true;
    }
    return false;
  }, [location.pathname]);
  const openBrowserToHome = useCallback(() => {
    const sendMessage: WebSendMessage = {
      type: "openBrowser",
      payload: "https://share.igame.ml",
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
  }, []);
  const openBrowserToQQGroup = useCallback(() => {
    const sendMessage: WebSendMessage = {
      type: "openBrowser",
      payload: "https://jq.qq.com/?_wv=1027&k=vH1V9RF1",
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
  }, []);

  if (show) {
    return (
      <Container
        sx={{
          maxWidth: theme.breakpoints.values.desktop,
          padding: "8px 0px",
          display: "flex",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: "1",
              textAlign: "center",
              fontWeight: "400",
            }}
          >
            获取更多免费游戏跟丰富MOD，请访问
            <Link
              underline="hover"
              sx={{
                cursor: "pointer",
              }}
              onClick={openBrowserToHome}
            >
              IGame资源站
            </Link>
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ margin: "0px 8px" }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: "0.9rem",
              lineHeight: "1",
              textAlign: "center",
              fontWeight: "400",
            }}
          >
            与其他同好交流，有问题询问作者，请加入
            <Link
              underline="hover"
              sx={{
                cursor: "pointer",
              }}
              onClick={openBrowserToQQGroup}
            >
              IGame交流群
            </Link>
          </Typography>
        </Box>
      </Container>
    );
  }

  return null;
};

export default Footer;
