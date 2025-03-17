import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Botão estilizado com base no MUI Button
const StyledButton = styled(MuiButton)(({ theme, size }) => ({
  borderRadius: size === 'small' ? 6 : 8,
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  
  // Tamanhos personalizados
  ...(size === 'small' && {
    padding: '6px 12px',
    fontSize: '0.875rem',
  }),
  ...(size === 'medium' && {
    padding: '8px 16px',
    fontSize: '1rem',
  }),
  ...(size === 'large' && {
    padding: '10px 20px',
    fontSize: '1.125rem',
  }),
}));

// Componente de botão personalizado
const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary', 
  size = 'medium', 
  loading = false,
  startIcon,
  endIcon,
  fullWidth = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      startIcon={!loading && startIcon}
      endIcon={!loading && endIcon}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <CircularProgress
            size={size === 'small' ? 16 : size === 'medium' ? 20 : 24}
            color="inherit"
            thickness={5}
            style={{ 
              position: 'absolute',
              left: '50%',
              marginLeft: size === 'small' ? -8 : size === 'medium' ? -10 : -12,
            }}
          />
          <span style={{ visibility: 'hidden' }}>{children}</span>
        </>
      ) : (
        children
      )}
    </StyledButton>
  );
};

export default Button; 