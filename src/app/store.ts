import { configureStore } from "@reduxjs/toolkit";

import { userSlice, resourceSlice, appSlice } from "@/slice";

const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
    [resourceSlice.name]: resourceSlice.reducer,
    [appSlice.name]: appSlice.reducer,
  },
});

// https://redux-toolkit.js.org/rtk-query/api/setupListeners
// setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
