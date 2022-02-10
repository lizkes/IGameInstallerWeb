import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/hook";
import {
  setResourceInstallInfo,
  ResourceInstallInfo,
} from "@/slice/resourceSlice";
import WebSendMessage from "@/model/WebSendMessage";
import WebRecvMessage, { ErrorPayload } from "@/model/WebRecvMessage";
import MessagePage from "@/page/Message";
import WaitingPage from "@/page/Waiting";

const PreparePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [needPrepare, setNeedPrepare] = useState<boolean>(true);
  const [infoMessage, setInfoMessage] =
    useState<string>("正在初始化检查引擎...");
  const [errorPayload, setErrorPayload] = useState<ErrorPayload | undefined>(
    undefined
  );

  useEffect(() => {
    if (needPrepare) {
      const sendMessage: WebSendMessage = {
        type: "startPrepare",
        payload: "",
      };
      window.chrome.webview.postMessage(JSON.stringify(sendMessage));
      setNeedPrepare(false);
    }
  }, [needPrepare]);
  useEffect(() => {
    const handle = (e: { data: string }) => {
      const recvMessage: WebRecvMessage = JSON.parse(e.data);
      if (recvMessage.type === "setPrompt") {
        setInfoMessage(recvMessage.payload);
      } else if (recvMessage.type === "startUpdate") {
        navigate("/update");
      } else if (recvMessage.type === "setResourceInstallInfo") {
        const info: ResourceInstallInfo = JSON.parse(recvMessage.payload);
        dispatch(setResourceInstallInfo(info));
        setInfoMessage("正在检查系统配置...");
      } else if (recvMessage.type === "prepareDone") {
        navigate("/config");
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

  return <WaitingPage message={infoMessage} />;
};

export default PreparePage;
