type WebRecvMessageType =
  | "setError"
  | "setPrompt"
  | "startUpdate"
  | "setResourceInstallInfo"
  | "prepareDone"
  | "setProgress"
  | "setInstallConfig"
  | "installDone";
type WebRecvMessage = {
  type: WebRecvMessageType;
  payload: string;
};

type ErrorPayload = {
  title: string;
  content: string;
};
type InstallConfigPayload = {
  installPath: string;
  installPathIsImmutable: boolean;
  needDesktopShortcut: boolean;
  needStartmenuShortcut: boolean;
  diskFreeSpace: number;
  inputLabel: string;
  successMessage: string;
  infoMessage: string;
  errorMessage: string;
};
type ProgressPayload = {
  topMessage: string;
  bottomMessage: string;
  progress: number;
};

export type { ErrorPayload, InstallConfigPayload, ProgressPayload };
export default WebRecvMessage;
