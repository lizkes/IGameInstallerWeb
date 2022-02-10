import { FC, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, LinearProgress, Typography } from "@mui/material";

import { useAppSelector } from "@/hook";
import WebSendMessage from "@/model/WebSendMessage";
import WebRecvMessage, {
  ErrorPayload,
  ProgressPayload,
} from "@/model/WebRecvMessage";
import BasePage from "@/page/Base";
import MessagePage from "@/page/Message";
import WaitingPage from "@/page/Waiting";
import WarnPic from "@public/Warn.jpg";

const InstallPage: FC = () => {
  const navigate = useNavigate();
  const downloadUrl = useAppSelector((s) => s.app.downloadUrl);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [installStarted, setInstallStarted] = useState<boolean>(false);
  const [topMessage, setTopMessage] = useState<string>("");
  const [bottomMessage, setBottomMessage] = useState<string>("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [errorPayload, setErrorPayload] = useState<ErrorPayload | undefined>(
    undefined
  );
  const cancelButtonClick = useCallback(() => {
    navigate("/confirm");
    const sendMessage: WebSendMessage = {
      type: "taskCancel",
      payload: "",
    };
    window.chrome.webview.postMessage(JSON.stringify(sendMessage));
  }, [navigate]);

  useEffect(() => {
    if (confirmed && !installStarted) {
      const sendMessage: WebSendMessage = {
        type: "startDownload",
        payload: downloadUrl,
      };
      window.chrome.webview.postMessage(JSON.stringify(sendMessage));
      setInstallStarted(true);
    }
  }, [confirmed, installStarted, downloadUrl]);
  useEffect(() => {
    const handle = (e: { data: string }) => {
      const recvMessage: WebRecvMessage = JSON.parse(e.data);
      if (recvMessage.type === "setProgress") {
        const payload: ProgressPayload = JSON.parse(recvMessage.payload);
        if (payload.topMessage !== "keep") setTopMessage(payload.topMessage);
        if (payload.bottomMessage !== "keep")
          setBottomMessage(payload.bottomMessage);
        if (payload.progress !== -2) setProgress(payload.progress);
      } else if (recvMessage.type === "setError") {
        const payload: ErrorPayload = JSON.parse(recvMessage.payload);
        setErrorPayload(payload);
      } else if (recvMessage.type === "installDone") {
        navigate("/done");
      }
    };
    window.chrome.webview.addEventListener("message", handle);
    return () => {
      window.chrome.webview.removeEventListener("message", handle);
    };
  });

  if (errorPayload) {
    return (
      <MessagePage
        variant="error"
        title={errorPayload.title}
        content={errorPayload.content}
        buttonText="返回"
        buttonClickFn={() => navigate("/confirm")}
      />
    );
  }

  if (!confirmed) {
    return (
      <MessagePage
        variant="installWarn"
        title="你被警告了"
        picture={WarnPic}
        content="在安装时，360卫士，腾讯管家等杀毒软件会尝试阻止安装<br/>
        可能会导致下载失败，安装出错，安装不完全的情况<br/>
        为了可以正确安装，请暂时关闭杀毒软件<br/>
        或者在安装时杀毒软件弹框点击全部允许<br/>
        本软件保证纯净无毒，不会进行一切与安装无关的行为<br/>
        如果您不信任我，请点击右上角关闭本软件"
        buttonCountDownText="请仔细阅读上方的提示"
        buttonText="我了解并已经关闭杀毒软件"
        buttonClickFn={() => {
          setConfirmed(true);
        }}
        buttonCountDownSeconds={5}
      />
    );
  }

  if (progress !== undefined) {
    return (
      <BasePage variant="center">
        <Box sx={{ flexGrow: 4 }} />
        {topMessage === "" ? null : (
          <Typography
            variant="h1"
            sx={{
              fontSize: "1.25rem",
              lineHeight: "1",
              textAlign: "center",
              fontWeight: "400",
              marginBottom: "16px",
              width: "700px",
              overflowWrap: "break-word",
            }}
          >
            {topMessage}
          </Typography>
        )}
        {progress >= 0 ? (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: "600px",
              height: "12px",
              borderRadius: "3px",
            }}
          />
        ) : (
          <LinearProgress
            variant="indeterminate"
            sx={{
              width: "600px",
              height: "12px",
              borderRadius: "3px",
            }}
          />
        )}
        {bottomMessage === "" ? null : (
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.6rem",
              lineHeight: "1",
              textAlign: "center",
              fontWeight: "400",
              marginTop: "4px",
              width: "700px",
              overflowWrap: "break-word",
              color: (t) => t.palette.primary.light,
            }}
          >
            {bottomMessage}
          </Typography>
        )}
        {progress >= 0 ? (
          <Button
            size="large"
            variant="contained"
            color="error"
            sx={{
              fontSize: "1.1rem",
              width: "100px",
              marginTop: "32px",
            }}
            onClick={cancelButtonClick}
          >
            取消
          </Button>
        ) : null}
        <Box sx={{ flexGrow: 5 }} />
      </BasePage>
    );
  }

  return <WaitingPage message="正在初始化下载引擎..." />;
};

export default InstallPage;
