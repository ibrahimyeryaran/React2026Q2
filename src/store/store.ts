import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './selectedItemsSlice';

// Per-request store factory (App Router renders on the server, so a shared
// singleton store would leak state across requests).
export const makeStore = () =>
  configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
