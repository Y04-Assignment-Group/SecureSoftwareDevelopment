import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export default configureStore({
  reducer: {
    userSlice,
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({ serializableCheck: false })],
});
