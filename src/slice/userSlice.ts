import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  userId: number;
};

const initialState: UserState = {
  userId: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        userId: action.payload,
      };
    },
  },
});

export const { setUserId } = userSlice.actions;
export default userSlice;
