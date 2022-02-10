import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ResourceInstallInfo = {
  id: number;
  name: string;
  englishName: string;
  type: "game" | "expansion" | "other";
  allowedExp: number;
  normalDownloadCost: number;
  fastDownloadCost: number;
  canNormalDownload: boolean;
  canFastDownload: boolean;
  postInstallPrompt: string;
  afterInstallPrompt: string;
  requireDepends: Array<string>;
  requireSystems: Array<string>;
  requireDisk: number;
  exePath: string;
  workDirPath: string;
  iconPath: string;
  shortCutArgument: string;
  immutableInstallPath: string;
  ensureFilePaths: Array<string>;
  installInputLabel: string;
  md5: string;
};

const initialState: ResourceInstallInfo = {
  id: 0,
  name: "",
  englishName: "",
  type: "other",
  allowedExp: 0,
  normalDownloadCost: 0,
  fastDownloadCost: 0,
  canNormalDownload: true,
  canFastDownload: true,
  postInstallPrompt: "",
  afterInstallPrompt: "",
  requireDepends: [],
  requireSystems: [],
  requireDisk: 0,
  exePath: "",
  workDirPath: "",
  iconPath: "",
  shortCutArgument: "",
  immutableInstallPath: "",
  ensureFilePaths: [],
  installInputLabel: "",
  md5: "",
};

const resourceSlice = createSlice({
  name: "resourceInstallInfo",
  initialState,
  reducers: {
    setResourceInstallInfo: (
      _state,
      action: PayloadAction<ResourceInstallInfo>
    ) => {
      return {
        ...action.payload,
      };
    },
  },
});

export type { ResourceInstallInfo };
export const { setResourceInstallInfo } = resourceSlice.actions;
export default resourceSlice;
