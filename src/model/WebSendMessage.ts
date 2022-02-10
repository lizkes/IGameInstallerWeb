type WebSendMessageType =
  | "startPrepare"
  | "generateInstallConfig"
  | "setInstallConfig"
  | "getInstallPath"
  | "startDownload"
  | "openBrowser"
  | "openGame"
  | "taskCancel"
  | "exit";
type WebSendMessage = {
  type: WebSendMessageType;
  payload: string;
};

export default WebSendMessage;
