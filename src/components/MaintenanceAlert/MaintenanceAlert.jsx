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
import { firebaseInitializationError, isFirebaseConfigured } from '../../firebaseConfig';
import './MaintenanceAlert.css';

function MaintenanceAlert() {
  const hasFirebaseIssue = !isFirebaseConfigured || Boolean(firebaseInitializationError);
  const [isDatabaseUnavailable, setIsDatabaseUnavailable] = useState(hasFirebaseIssue);
  const [open, setOpen] = useState(hasFirebaseIssue);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const theme = useTheme();
  const shouldForceMaintenance = isDatabaseUnavailable;

  useEffect(() => {
    const handleDatabaseUnavailable = () => {
      setIsDatabaseUnavailable(true);
      setOpen(true);
    };

    window.addEventListener('database-unavailable', handleDatabaseUnavailable);

    if (hasFirebaseIssue) {
      setIsDatabaseUnavailable(true);
      setOpen(true);
      return () => window.removeEventListener('database-unavailable', handleDatabaseUnavailable);
    }

    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (!hasVisited) {
      setOpen(true);
    }

    return () => window.removeEventListener('database-unavailable', handleDatabaseUnavailable);
  }, [hasFirebaseIssue]);

  const handleClose = () => {
    if (shouldForceMaintenance) {
      setOpen(false);
      return;
    }

    localStorage.setItem('hasVisitedBefore', 'true');

    if (dontShowAgain) {
      localStorage.setItem('neverShowMaintenanceAlert', 'true');
    }

    setOpen(false);
  };

  const handleDontShowAgainChange = (event) => {
    setDontShowAgain(event.target.checked);
  };

  if (!shouldForceMaintenance && localStorage.getItem('neverShowMaintenanceAlert') === 'true') {
    return null;
  }

  const title = shouldForceMaintenance ? 'Site em Manutenção' : 'Site em Desenvolvimento';
  const mainMessage = shouldForceMaintenance
    ? 'Estou reconstruindo a base de dados do portfólio. Algumas seções podem aparecer vazias ou temporariamente indisponíveis.'
    : 'Obrigado por visitar! Este site está atualmente em fase de manutenção e desenvolvimento. Algumas funcionalidades podem não estar completas ou podem apresentar comportamentos inesperados.';
  const secondaryMessage = shouldForceMaintenance
    ? 'Volte em breve para ver os projetos, experiências e demais informações atualizadas.'
    : 'Agradecemos sua compreensão enquanto trabalhamos para melhorar sua experiência.';

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
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" className="maintenance-alert-message">
          {mainMessage}
        </Typography>

        <Box className="maintenance-alert-icon-container" mt={2}>
          <WarningIcon className="maintenance-alert-icon" color="warning" />
        </Box>

        <Typography variant="body2" mt={2} color="text.secondary" textAlign="center">
          {secondaryMessage}
        </Typography>

        {!shouldForceMaintenance && (
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
        )}
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
