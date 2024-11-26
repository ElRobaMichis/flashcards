import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, Typography, Paper, LinearProgress, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { RootState } from '../store';
import { updateLearningProgress } from '../features/flashcards/flashcardsSlice';
import { Flashcard, QuizQuestion } from '../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import { motion } from 'framer-motion';

const Quiz: React.FC = () => {
    const dispatch = useDispatch();
    const allFlashcards = useSelector((state: RootState) => state.flashcards.items);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

    // Get unique source languages from flashcards
    const availableLanguages = useMemo(() => {
        const languages = new Set(allFlashcards.map(card => card.sourceLanguage));
        return Array.from(languages);
    }, [allFlashcards]);

    const getRecentFlashcards = () => {
        let filteredCards = [...allFlashcards].filter(card => !card.isLearned);
        
        // Apply language filter if a specific language is selected
        if (selectedLanguage !== 'all') {
            filteredCards = filteredCards.filter(card => card.sourceLanguage === selectedLanguage);
        }

        return filteredCards
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 20);
    };

    const generateQuestion = () => {
        const recentCards = getRecentFlashcards();
        if (recentCards.length === 0) return null;

        const currentCard = recentCards[Math.floor(Math.random() * recentCards.length)];
        const otherCards = recentCards.filter(card => card.id !== currentCard.id);
        
        // Generate 3 random incorrect options
        const incorrectOptions = otherCards
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(card => card.translation);

        // Add correct answer and shuffle
        const options = [...incorrectOptions, currentCard.translation]
            .sort(() => Math.random() - 0.5);

        return {
            flashcard: currentCard,
            options,
            correctAnswer: currentCard.translation
        };
    };

    useEffect(() => {
        if (!currentQuestion) {
            setCurrentQuestion(generateQuestion());
        }
    }, [allFlashcards, selectedLanguage]);

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        
        setSelectedAnswer(answer);
        setIsAnswered(true);
        
        const isCorrect = answer === currentQuestion?.correctAnswer;
        if (currentQuestion) {
            dispatch(updateLearningProgress({ 
                id: currentQuestion.flashcard.id, 
                correct: isCorrect 
            }));
        }
        
        if (isCorrect) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        setCurrentQuestion(generateQuestion());
    };

    const handleLanguageChange = (event: { target: { value: string } }) => {
        setSelectedLanguage(event.target.value);
        setCurrentQuestion(null); // Reset current question when language changes
        setScore(0); // Reset score when language changes
    };

    if (allFlashcards.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5">
                    Add some flashcards to start the quiz!
                </Typography>
            </Box>
        );
    }

    const availableCardsCount = getRecentFlashcards().length;

    if (availableCardsCount === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <FormControl sx={{ minWidth: 200, mb: 3 }}>
                    <InputLabel>Source Language</InputLabel>
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        label="Source Language"
                    >
                        <MenuItem value="all">All Languages</MenuItem>
                        {availableLanguages.map(lang => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="h5">
                    {selectedLanguage === 'all' 
                        ? "All flashcards have been learned! Add more or reset some cards to continue."
                        : `All flashcards in ${selectedLanguage} have been learned! Try another language or add more cards.`}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    Score: {score}
                </Typography>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Source Language</InputLabel>
                    <Select
                        value={selectedLanguage}
                        onChange={handleLanguageChange}
                        label="Source Language"
                    >
                        <MenuItem value="all">All Languages</MenuItem>
                        {availableLanguages.map(lang => (
                            <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {currentQuestion && (
                <>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3, 
                            mb: 3, 
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {currentQuestion.flashcard.isLearned && (
                            <Chip
                                icon={<CheckCircleIcon />}
                                label="Learned!"
                                color="success"
                                sx={{ 
                                    position: 'absolute',
                                    top: 8,
                                    right: 8
                                }}
                            />
                        )}
                        <Typography variant="h5" gutterBottom>
                            {currentQuestion.flashcard.term}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Translate from {currentQuestion.flashcard.sourceLanguage} to {currentQuestion.flashcard.targetLanguage}
                        </Typography>
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <LinearProgress 
                                variant="determinate" 
                                value={(currentQuestion.flashcard.correctCount / 10) * 100}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: currentQuestion.flashcard.isLearned ? 'success.main' : 'primary.main',
                                    }
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                            Learning Progress: {currentQuestion.flashcard.correctCount}/10
                        </Typography>
                    </Paper>

                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {currentQuestion.options.map((option, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => handleAnswer(option)}
                                    disabled={isAnswered}
                                    sx={{
                                        p: 2,
                                        justifyContent: 'flex-start',
                                        backgroundColor: isAnswered
                                            ? option === currentQuestion.correctAnswer
                                                ? 'success.light'
                                                : option === selectedAnswer
                                                    ? 'error.light'
                                                    : 'transparent'
                                            : 'transparent',
                                        '&:hover': {
                                            backgroundColor: isAnswered
                                                ? option === currentQuestion.correctAnswer
                                                    ? 'success.light'
                                                    : option === selectedAnswer
                                                        ? 'error.light'
                                                        : 'action.hover'
                                                : 'action.hover'
                                        }
                                    }}
                                >
                                    {option}
                                </Button>
                            </motion.div>
                        ))}
                    </Box>

                    {isAnswered && (
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography 
                                variant="h6" 
                                color={selectedAnswer === currentQuestion.correctAnswer ? 'success.main' : 'error.main'}
                                gutterBottom
                            >
                                {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 2 }}
                            >
                                Next Question
                            </Button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default Quiz;
