export interface Flashcard {
    id: string;
    term: string;
    translation: string;
    sourceLanguage: string;
    targetLanguage: string;
    example?: string;
    comment?: string;
    lastReviewed?: string;
    correctCount: number;
    isLearned: boolean;
    createdAt: string;
}

export interface Language {
    code: string;
    name: string;
}

export interface QuizQuestion {
    flashcard: Flashcard;
    options: string[];
    correctAnswer: string;
}

export interface UserStats {
    totalCards: number;
    masteredCards: number;
    cardsToReview: number;
}
