import React from 'react';
import { TextField as MuiTextField, InputAdornment, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// TextField estilizado com base no MUI TextField
const StyledTextField = styled(MuiTextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    transition: 'all 0.3s ease',
    
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    },
    
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
    },
  },
  
  '& .MuiInputLabel-root': {
    transition: 'all 0.3s ease',
  },
  
  '& .MuiInputBase-input': {
    padding: '14px 16px',
  },
}));

// Componente de campo de texto personalizado
const TextField = ({
  label,
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
  startIcon,
  endIcon,
  loading = false,
  error = false,
  helperText,
  multiline = false,
  rows = 4,
  ...props
}) => {
  return (
    <StyledTextField
      label={label}
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {startIcon}
          </InputAdornment>
        ) : null,
        endAdornment: (
          <InputAdornment position="end">
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              endIcon || null
            )}
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default TextField; 