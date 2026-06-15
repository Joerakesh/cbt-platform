import { configureStore, combineReducers } from "@reduxjs/toolkit";

import studentReducer from "./studentSlice";

import storage from "redux-persist/lib/storage";

import { persistReducer, persistStore } from "redux-persist";

// Combine reducers
const rootReducer = combineReducers({
  student: studentReducer,
});

// Persist config
const persistConfig = {
  key: "root",

  storage,
};

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
