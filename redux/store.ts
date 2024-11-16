import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Use AsyncStorage for React Native
import { usersSlice } from "./slice/userSlice";

// Configuring the persistence
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage, // Use AsyncStorage instead of the default storage
};

// Combine reducers
export const reducer = combineReducers({
  users: usersSlice.reducer,
});

// Persist the reducer
const persistedReducer = persistReducer(persistConfig, reducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
