import { createTheme } from '@mui/material/styles';

// Tema personalizado para o Material UI
const getTheme = (isDarkMode) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: isDarkMode ? '#0088ff' : '#007bff',
      light: isDarkMode ? '#33a1ff' : '#3395ff',
      dark: isDarkMode ? '#0066cc' : '#0056b3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: isDarkMode ? '#00e5ff' : '#00c8d4',
      light: isDarkMode ? '#33eaff' : '#33d4dd',
      dark: isDarkMode ? '#00a0b2' : '#008c94',
      contrastText: isDarkMode ? '#000000' : '#ffffff',
    },
    background: {
      default: isDarkMode ? '#121212' : '#f5f5f5',
      paper: isDarkMode ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: isDarkMode ? '#ffffff' : '#333333',
      secondary: isDarkMode ? '#b0b0b0' : '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
      marginBottom: '0.8rem',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '0.6rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      marginBottom: '0.4rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      marginBottom: '0.3rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: isDarkMode ? '#0099ff' : '#0069d9',
          },
        },
        containedSecondary: {
          '&:hover': {
            backgroundColor: isDarkMode ? '#00f2ff' : '#00d5e3',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: isDarkMode 
            ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
            : '0 8px 16px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: isDarkMode 
              ? '0 12px 20px rgba(0, 0, 0, 0.5)' 
              : '0 12px 20px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: isDarkMode 
            ? '0 2px 8px rgba(0, 0, 0, 0.5)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
  },
});

export default getTheme; 