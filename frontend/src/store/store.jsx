import { configureStore } from "@reduxjs/toolkit";
import authTokenSlice from "./authSlice";
//Persist states import
import storageSession from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";

const authTokenPersistConfig = {
  key: "authToken",
  storage: storageSession,
};



export const store = configureStore({
  reducer: {
    authToken: persistReducer(authTokenPersistConfig, authTokenSlice.reducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
