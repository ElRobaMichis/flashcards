import React, { useState } from 'react';
import { Container, Box, Tabs, Tab, AppBar, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store';
import { FlashcardForm } from './components/FlashcardForm';
import { FlashcardList } from './components/FlashcardList';
import Quiz from './components/Quiz';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2196f3',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          '&.Mui-selected': {
            color: '#2196f3',
          },
        },
      },
    },
  },
});

function App() {
  const [currentTab, setCurrentTab] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
          <AppBar position="static" elevation={0}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab label="View Flashcards" />
              <Tab label="Add Flashcard" />
              <Tab label="Quiz" />
            </Tabs>
          </AppBar>

          <Container sx={{ py: 4 }}>
            {currentTab === 0 && <FlashcardList />}
            {currentTab === 1 && <FlashcardForm />}
            {currentTab === 2 && <Quiz />}
          </Container>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
