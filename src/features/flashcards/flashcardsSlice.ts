import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Flashcard } from '../../types';

// Load initial state from localStorage
const loadState = (): Flashcard[] => {
    try {
        const serializedState = localStorage.getItem('flashcards');
        if (serializedState === null) {
            return [];
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return [];
    }
};

// Save state to localStorage
const saveState = (state: Flashcard[]) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('flashcards', serializedState);
    } catch (err) {
        console.error('Failed to save state to localStorage:', err);
    }
};

interface FlashcardsState {
    items: Flashcard[];
    loading: boolean;
    error: string | null;
    editingCard: Flashcard | null;
}

const initialState: FlashcardsState = {
    items: loadState(),
    loading: false,
    error: null,
    editingCard: null,
};

const flashcardsSlice = createSlice({
    name: 'flashcards',
    initialState,
    reducers: {
        addFlashcard: (state, action: PayloadAction<Omit<Flashcard, 'correctCount' | 'isLearned' | 'createdAt' | 'lastReviewed'>>) => {
            state.items.push({
                ...action.payload,
                correctCount: 0,
                isLearned: false,
                createdAt: new Date().toISOString(),
                lastReviewed: undefined,
            });
            saveState(state.items);
        },
        updateFlashcard: (state, action: PayloadAction<Flashcard>) => {
            const index = state.items.findIndex(card => card.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
                saveState(state.items);
            }
            state.editingCard = null;
        },
        deleteFlashcard: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(card => card.id !== action.payload);
            saveState(state.items);
        },
        setEditingCard: (state, action: PayloadAction<Flashcard | null>) => {
            state.editingCard = action.payload;
        },
        updateLearningProgress: (state, action: PayloadAction<{ id: string, correct: boolean }>) => {
            const card = state.items.find(item => item.id === action.payload.id);
            if (card) {
                if (action.payload.correct) {
                    card.correctCount += 1;
                    if (card.correctCount >= 10) {
                        card.isLearned = true;
                    }
                } else {
                    card.correctCount = Math.max(0, card.correctCount - 1);
                    card.isLearned = false;
                }
                card.lastReviewed = new Date().toISOString();
                saveState(state.items);
            }
        },
        toggleLearnedStatus: (state, action: PayloadAction<string>) => {
            const card = state.items.find(card => card.id === action.payload);
            if (card) {
                card.isLearned = !card.isLearned;
                // Reset correct count when manually toggling learned status
                card.correctCount = card.isLearned ? 10 : 0;
                saveState(state.items);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    setEditingCard,
    updateLearningProgress,
    toggleLearnedStatus,
    setLoading,
    setError,
} = flashcardsSlice.actions;

export default flashcardsSlice.reducer;
