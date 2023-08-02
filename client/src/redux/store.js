import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import videoReducer from "./videoSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Combining both the reducers into a single
const rootReducer = combineReducers({ user: userReducer, video: videoReducer });

// Stores the data on the local storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  // After root reducer we don't need these separately
  // reducer: { user: userReducer, video: videoReducer },
  reducer: persistedReducer,

  // Will be getting an error if don't use middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
