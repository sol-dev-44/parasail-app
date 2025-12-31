import { configureStore } from '@reduxjs/toolkit';
import { parasailApi } from './api/parasailApi';
import chuteReducer from './slices/chuteSlice';

export const store = configureStore({
    reducer: {
        [parasailApi.reducerPath]: parasailApi.reducer,
        chute: chuteReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(parasailApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
