import { FC, useCallback, useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useModal } from "mui-modal-provider";

import { useAppSelector } from "@/hook";
import WebSendMessage from "@/model/WebSendMessage";
import BasePage from "@/page/Base";
import AlipayQRCode from "@public/AlipayQRCode@0.5x.png";
import WechatQRCode from "@public/WechatQRCode@0.5x.png";

import PromptDialog from "./PromptDialog";

const DonePage: FC = () => {
  const { showModal } = useModal();
  const resourceInstallInfo = useAppSelector((s) => s.resourceInstallInfo);
  const [openGameButtonLoading, setOpenGameButtonLoading] =
    useState<boolean>(false);
  const [promptIsShow, setPromptIsShow] = useState<boolean>(false);

  const openGame = useCallback(() => {
    const sendMessage: WebSendMessage = {
      type: "openGame",
      payload: "",
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
    setOpenGameButtonLoading(true);
  }, []);
  const exit = useCallback(() => {
    const sendMessage: WebSendMessage = {
      type: "exit",
      payload: "",
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
  }, []);

  useEffect(() => {
    if (
      !promptIsShow &&
      resourceInstallInfo.afterInstallPrompt !== "" &&
      resourceInstallInfo.afterInstallPrompt !== null
    ) {
      setPromptIsShow(true);
      const modal = showModal(PromptDialog, {
        title: "安装后说明",
        content: resourceInstallInfo.afterInstallPrompt,
        closeFn: () => {
          modal.hide();
        },
      });
    }
  }, [promptIsShow, resourceInstallInfo.afterInstallPrompt, showModal]);
  useEffect(() => {
    if (openGameButtonLoading) {
      const timeoutId = setTimeout(() => setOpenGameButtonLoading(false), 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [openGameButtonLoading]);

  return (
    <BasePage variant="center">
      <Box sx={{ flexGrow: 1 }} />
      <Typography
        sx={{
          fontSize: "1.1rem",
          lineHeight: "1.4",
          textAlign: "center",
          fontWeight: "400",
          whiteSpace: "pre-line",
        }}
      >
        {`体验不错？本软件的存储跟下载都需要成本
          您可以扫码捐赠来支持我继续维护本软件`}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <img src={AlipayQRCode} width="200" />
        <img src={WechatQRCode} width="200" />
      </Box>
      <Box sx={{ flexGrow: 2 }} />
      {resourceInstallInfo.exePath === "" ||
      resourceInstallInfo.exePath === null ? null : (
        <LoadingButton
          variant="contained"
          size="large"
          sx={{
            width: "240px",
            fontSize: "1.1rem",
            marginBottom: "16px",
            backgroundColor: (t) => t.palette.success.main,
            transition: "all 150ms",
            ":hover": {
              background: (t) => t.palette.success.main,
              filter: "brightness(0.9)",
            },
          }}
          loading={openGameButtonLoading}
          onClick={openGame}
        >
          启动游戏
        </LoadingButton>
      )}
      <Button
        variant="contained"
        size="large"
        sx={{
          width: "240px",
          fontSize: "1.1rem",
          backgroundColor: (t) => t.palette.primary.main,
          transition: "all 150ms",
          ":hover": {
            background: (t) => t.palette.primary.main,
            filter: "brightness(0.9)",
          },
        }}
        onClick={exit}
      >
        退出
      </Button>
      <Box sx={{ flexGrow: 2 }} />
    </BasePage>
  );
};

export default DonePage;
