import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  downloadUrl: string;
};

const initialState: AppState = {
  downloadUrl: "",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDownloadUrl: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        downloadUrl: action.payload,
      };
    },
  },
});

export const { setDownloadUrl } = appSlice.actions;
export default appSlice;
