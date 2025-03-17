import React, { memo, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';

// Tamanhos de avatar predefinidos
const sizes = {
  small: { width: '40px', height: '40px' },
  medium: { width: '60px', height: '60px' },
  large: { width: '100px', height: '100px' },
  xlarge: { width: '150px', height: '150px' },
  xxlarge: { width: '200px', height: '200px' },
};

// Avatar estilizado
const StyledAvatar = styled('div')(({ theme, $size, $isLoading }) => ({
  position: 'relative',
  width: typeof $size === 'object' ? $size.width : (sizes[$size] ? sizes[$size].width : sizes.medium.width),
  height: typeof $size === 'object' ? $size.height : (sizes[$size] ? sizes[$size].height : sizes.medium.height),
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: $isLoading ? 'transparent' : theme.palette.grey[300],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

// Imagem estilizada com renderização otimizada
const StyledImage = styled('img')(({ $loaded }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: $loaded ? 'block' : 'none',
  transform: 'translateZ(0)', // Hardware acceleration
  willChange: 'opacity', // Avisar ao navegador que esta propriedade será animada
  backfaceVisibility: 'hidden',
}));

// Componente Avatar
const Avatar = memo(({ 
  src, 
  alt = 'Avatar', 
  size = 'medium', 
  className = '', 
  sx = {} 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Verificar se a imagem já está em cache do navegador
  useEffect(() => {
    // Verificar se a imagem já está no cache
    if (src) {
      const img = new Image();
      img.src = src;
      
      if (img.complete) {
        setLoaded(true);
      }
    }
  }, [src]);

  // Funções para tratamento do carregamento
  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  // Calcular largura para parâmetro 'sizes' do img
  const getImageSizes = () => {
    let width;
    
    if (typeof size === 'object') {
      width = parseInt(size.width, 10);
    } else {
      width = parseInt(sizes[size]?.width || sizes.medium.width, 10);
    }
    
    return `(max-width: 600px) ${width / 2}px, ${width}px`;
  };

  return (
    <StyledAvatar 
      $size={size} 
      className={className} 
      sx={sx}
      $isLoading={!loaded} 
    >
      {!loaded && (
        <CircularProgress 
          size={
            typeof size === 'object' 
              ? Math.min(parseInt(size.width, 10), parseInt(size.height, 10)) / 3 
              : parseInt(sizes[size]?.width || sizes.medium.width, 10) / 3
          } 
        />
      )}

      {/* Apenas para mostrar placeholder em caso de erro */}
      {error && loaded && (
        <div 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#e1e1e1',
            color: '#666',
            fontSize: '1rem'
          }}
        >
          {alt.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Carregamento otimizado de imagem */}
      {src && !error && (
        <StyledImage
          src={src}
          alt={alt}
          loading="eager" // Carregar com alta prioridade para elementos visíveis inicialmente
          decoding="async" // Permite decodificação assíncrona
          fetchPriority="high" // Prioridade alta para imagens importantes
          sizes={getImageSizes()}
          onLoad={handleLoad}
          onError={handleError}
          $loaded={loaded}
        />
      )}
    </StyledAvatar>
  );
});

export default Avatar; 