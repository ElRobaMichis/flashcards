import { configureStore } from '@reduxjs/toolkit';
import flashcardsReducer from '../features/flashcards/flashcardsSlice';

export const store = configureStore({
    reducer: {
        flashcards: flashcardsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
