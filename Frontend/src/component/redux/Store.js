import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice"; // adjust path as needed
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'bageasy',
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const Store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
});

export const persistor = persistStore(Store);
export default Store;
