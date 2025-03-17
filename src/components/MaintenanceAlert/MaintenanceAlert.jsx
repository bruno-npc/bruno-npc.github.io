import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Button, 
  Box, 
  useTheme,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { 
  Warning as WarningIcon, 
  Construction as ConstructionIcon
} from '@mui/icons-material';
import './MaintenanceAlert.css';

function MaintenanceAlert() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Verifica se é a primeira visita
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // Se for a primeira visita, mostra o alerta
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    // Marca que o usuário já viu o alerta
    localStorage.setItem('hasVisitedBefore', 'true');
    
    // Se a opção "não mostrar novamente" estiver marcada,
    // armazena essa preferência (versão persistente)
    if (dontShowAgain) {
      localStorage.setItem('neverShowMaintenanceAlert', 'true');
    }
    
    setOpen(false);
  };

  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
  };

  // Se o usuário escolheu nunca mais ver o alerta, não mostra
  if (localStorage.getItem('neverShowMaintenanceAlert') === 'true') {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="maintenance-alert-dialog"
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxWidth: '500px',
          width: '90%'
        }
      }}
    >
      <DialogTitle id="alert-dialog-title" className="maintenance-alert-title">
        <Box display="flex" alignItems="center">
          <ConstructionIcon 
            sx={{ 
              mr: 1, 
              color: theme.palette.warning.main,
              fontSize: '2rem'
            }} 
          />
          <Typography variant="h5" component="span" fontWeight="bold">
            Site em Desenvolvimento
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" className="maintenance-alert-message">
          Obrigado por visitar! Este site está atualmente em fase de manutenção e desenvolvimento.
          Algumas funcionalidades podem não estar completas ou podem apresentar comportamentos inesperados.
        </Typography>
        
        <Box className="maintenance-alert-icon-container" mt={2}>
          <WarningIcon className="maintenance-alert-icon" color="warning" />
        </Box>
        
        <Typography variant="body2" mt={2} color="text.secondary" textAlign="center">
          Agradecemos sua compreensão enquanto trabalhamos para melhorar sua experiência.
        </Typography>
        
        <Box mt={2} textAlign="center">
          <FormControlLabel
            control={
              <Checkbox 
                checked={dontShowAgain} 
                onChange={handleDontShowAgainChange} 
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Não mostrar novamente
              </Typography>
            }
          />
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button 
          onClick={handleClose} 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ borderRadius: 2, py: 1 }}
        >
          Entendi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MaintenanceAlert; 