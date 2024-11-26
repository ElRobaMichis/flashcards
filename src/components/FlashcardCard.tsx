import React, { useState } from 'react';
import { Card, CardContent, Typography, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Flashcard } from '../types';
import { useDispatch } from 'react-redux';
import { deleteFlashcard, updateFlashcard, toggleLearnedStatus } from '../features/flashcards/flashcardsSlice';
import { motion } from 'framer-motion';

interface Props {
    flashcard: Flashcard;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
];

export const FlashcardCard: React.FC<Props> = ({ flashcard }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedCard, setEditedCard] = useState<Flashcard>(flashcard);
    const dispatch = useDispatch();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this flashcard?')) {
            dispatch(deleteFlashcard(flashcard.id));
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditDialogOpen(true);
    };

    const handleSave = () => {
        dispatch(updateFlashcard(editedCard));
        setIsEditDialogOpen(false);
    };

    const handleCancel = () => {
        setEditedCard(flashcard);
        setIsEditDialogOpen(false);
    };

    const handleToggleLearned = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(toggleLearnedStatus(flashcard.id));
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ perspective: 1000 }}
            >
                <Card
                    onClick={() => setIsFlipped(!isFlipped)}
                    sx={{
                        height: 200,
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: flashcard.isLearned ? 'action.selected' : 'background.paper',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    <motion.div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s',
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 2,
                            }}
                        >
                            <Typography variant="h5" component="div" align="center" gutterBottom>
                                {flashcard.term}
                            </Typography>
                            <Typography color="text.secondary" align="center">
                                {languages.find(l => l.code === flashcard.sourceLanguage)?.name || flashcard.sourceLanguage}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                p: 2,
                            }}
                        >
                            <Typography variant="h5" component="div" align="center" gutterBottom>
                                {flashcard.translation}
                            </Typography>
                            <Typography color="text.secondary" align="center" gutterBottom>
                                {languages.find(l => l.code === flashcard.targetLanguage)?.name || flashcard.targetLanguage}
                            </Typography>
                            {flashcard.example && (
                                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                    Example: {flashcard.example}
                                </Typography>
                            )}
                            {flashcard.comment && (
                                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                                    Note: {flashcard.comment}
                                </Typography>
                            )}
                        </Box>
                    </motion.div>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            display: 'flex',
                            gap: 1,
                        }}
                    >
                        <Tooltip title={flashcard.isLearned ? "Mark as not learned" : "Mark as learned"}>
                            <IconButton 
                                size="medium" 
                                onClick={handleToggleLearned}
                                sx={{ 
                                    color: flashcard.isLearned ? 'success.main' : 'action.disabled',
                                    '&:hover': {
                                        color: flashcard.isLearned ? 'error.main' : 'success.main'
                                    }
                                }}
                            >
                                {flashcard.isLearned ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                            </IconButton>
                        </Tooltip>
                        <IconButton 
                            size="medium" 
                            onClick={handleDelete}
                            sx={{ 
                                color: 'error.main',
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'error.dark',
                                },
                                '& .MuiTypography-root': {
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                }
                            }}
                        >
                            <Typography variant="button">×</Typography>
                        </IconButton>
                        <IconButton 
                            size="medium" 
                            onClick={handleEdit}
                            sx={{ 
                                color: 'primary.main',
                                width: 36,
                                height: 36,
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark',
                                },
                                '& .MuiTypography-root': {
                                    fontSize: '1.2rem',
                                    lineHeight: 1,
                                }
                            }}
                        >
                            <Typography variant="button">✎</Typography>
                        </IconButton>
                    </Box>
                </Card>
            </motion.div>

            <Dialog open={isEditDialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Flashcard</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Term"
                            value={editedCard.term}
                            onChange={(e) => setEditedCard({ ...editedCard, term: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Translation"
                            value={editedCard.translation}
                            onChange={(e) => setEditedCard({ ...editedCard, translation: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Source Language"
                            value={editedCard.sourceLanguage}
                            onChange={(e) => setEditedCard({ ...editedCard, sourceLanguage: e.target.value })}
                            fullWidth
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Target Language"
                            value={editedCard.targetLanguage}
                            onChange={(e) => setEditedCard({ ...editedCard, targetLanguage: e.target.value })}
                            fullWidth
                        >
                            {languages.map((lang) => (
                                <MenuItem key={lang.code} value={lang.code}>
                                    {lang.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Example (optional)"
                            value={editedCard.example || ''}
                            onChange={(e) => setEditedCard({ ...editedCard, example: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Comment (optional)"
                            value={editedCard.comment || ''}
                            onChange={(e) => setEditedCard({ ...editedCard, comment: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
