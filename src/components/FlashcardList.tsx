import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Grid, Typography, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { RootState } from '../store';
import { FlashcardCard } from './FlashcardCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';

export const FlashcardList: React.FC = () => {
    const flashcards = useSelector((state: RootState) => state.flashcards.items);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

    // Get unique source languages from flashcards
    const availableLanguages = useMemo(() => {
        const languages = new Set(flashcards.map(card => card.sourceLanguage));
        return Array.from(languages);
    }, [flashcards]);

    // Filter flashcards by language
    const filteredFlashcards = useMemo(() => {
        if (selectedLanguage === 'all') {
            return flashcards;
        }
        return flashcards.filter(card => card.sourceLanguage === selectedLanguage);
    }, [flashcards, selectedLanguage]);

    const learnedCount = filteredFlashcards.filter(card => card.isLearned).length;
    const totalCount = filteredFlashcards.length;

    const handleLanguageChange = (event: { target: { value: string } }) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5">
                    Your Flashcards
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Chip
                        icon={<SchoolIcon />}
                        label={`${learnedCount}/${totalCount} Learned`}
                        color="success"
                        variant="outlined"
                    />
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Source Language</InputLabel>
                        <Select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            label="Source Language"
                            startAdornment={<FilterListIcon sx={{ ml: 1, mr: 0.5, color: 'action.active' }} />}
                        >
                            <MenuItem value="all">All Languages</MenuItem>
                            {availableLanguages.map(lang => (
                                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {filteredFlashcards.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                    {flashcards.length === 0 
                        ? "No flashcards yet. Add some to get started!"
                        : `No flashcards found for ${selectedLanguage}. Try another language or add some cards.`
                    }
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {filteredFlashcards.map((flashcard) => (
                        <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                            <Box sx={{ position: 'relative' }}>
                                {flashcard.isLearned && (
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Learned!"
                                        color="success"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            zIndex: 1,
                                        }}
                                    />
                                )}
                                <FlashcardCard flashcard={flashcard} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};
