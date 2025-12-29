import { configureStore } from '@reduxjs/toolkit';

import { newRequestReducer } from '@/features/new-request/store/slice';
import { api } from '@/services/api/api';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    newRequest: newRequestReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
