import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { addFlashcard } from '../features/flashcards/flashcardsSlice';
import { Flashcard } from '../types';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'ja', name: 'Japanese' },
];

export const FlashcardForm: React.FC = () => {
    const dispatch = useDispatch();
    const { control, register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {
            sourceLanguage: 'en',
            targetLanguage: 'es',
            term: '',
            translation: '',
            example: '',
            comment: ''
        }
    });

    const sourceLanguage = watch('sourceLanguage');
    const targetLanguage = watch('targetLanguage');

    // Update target language if it's the same as source language
    useEffect(() => {
        if (sourceLanguage === targetLanguage) {
            const availableLanguages = languages.filter(lang => lang.code !== sourceLanguage);
            if (availableLanguages.length > 0) {
                setValue('targetLanguage', availableLanguages[0].code);
            }
        }
    }, [sourceLanguage, targetLanguage, setValue]);

    const onSubmit = (data: any) => {
        const newFlashcard: Omit<Flashcard, 'correctCount' | 'isLearned' | 'createdAt'> = {
            id: uuidv4(),
            term: data.term,
            translation: data.translation,
            sourceLanguage: data.sourceLanguage,
            targetLanguage: data.targetLanguage,
            example: data.example || undefined,
            comment: data.comment || undefined,
        };
        dispatch(addFlashcard(newFlashcard));
        reset();
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                Add New Flashcard
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2, maxWidth: 600, mx: 'auto' }}>
                <Controller
                    name="sourceLanguage"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Source Language"
                            fullWidth
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                />

                <Controller
                    name="targetLanguage"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label="Target Language"
                            fullWidth
                        >
                            {languages
                                .filter(lang => lang.code !== sourceLanguage)
                                .map((lang) => (
                                    <MenuItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </MenuItem>
                                ))}
                        </TextField>
                    )}
                />

                <TextField
                    label="Term"
                    {...register('term', { required: 'Term is required' })}
                    fullWidth
                />

                <TextField
                    label="Translation"
                    {...register('translation', { required: 'Translation is required' })}
                    fullWidth
                />

                <TextField
                    label="Example (optional)"
                    {...register('example')}
                    multiline
                    rows={2}
                    fullWidth
                />

                <TextField
                    label="Comment (optional)"
                    {...register('comment')}
                    multiline
                    rows={2}
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Add Flashcard
                </Button>
            </Box>
        </Box>
    );
};
