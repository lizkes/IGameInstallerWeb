import { FC, useState, useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";

import WebRecvMessage, {
  ErrorPayload,
  ProgressPayload,
} from "@/model/WebRecvMessage";
import BasePage from "@/page/Base";
import MessagePage from "@/page/Message";
import WaitingPage from "@/page/Waiting";

const UpdatePage: FC = () => {
  const [topMessage, setTopMessage] = useState<string>("");
  const [bottomMessage, setBottomMessage] = useState<string>("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [errorPayload, setErrorPayload] = useState<ErrorPayload | undefined>(
    undefined
  );

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
        title={errorPayload.title}
        content={errorPayload.content}
        variant="error"
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
              width: "500px",
              height: "12px",
              borderRadius: "3px",
            }}
          />
        ) : (
          <LinearProgress
            variant="indeterminate"
            sx={{
              width: "500px",
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
              color: (t) => t.palette.primary.light,
            }}
          >
            {bottomMessage}
          </Typography>
        )}
        <Box sx={{ flexGrow: 5 }} />
      </BasePage>
    );
  }

  return <WaitingPage message="正在初始化更新引擎..." />;
};

export default UpdatePage;
