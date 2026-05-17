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
import { DEFAULT_SITE_SETTINGS, getSiteSettings } from '../../services/siteSettings';
import './MaintenanceAlert.css';

function MaintenanceAlert() {
  const hasFirebaseIssue = !isFirebaseConfigured || Boolean(firebaseInitializationError);
  const [isDatabaseUnavailable, setIsDatabaseUnavailable] = useState(hasFirebaseIssue);
  const [open, setOpen] = useState(hasFirebaseIssue);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS.maintenance);
  const theme = useTheme();
  const shouldForceMaintenance = isDatabaseUnavailable;

  useEffect(() => {
    getSiteSettings().then((siteSettings) => setSettings(siteSettings.maintenance));

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

  const title = shouldForceMaintenance ? settings.databaseTitle : settings.developmentTitle;
  const mainMessage = shouldForceMaintenance ? settings.databaseMessage : settings.developmentMessage;
  const secondaryMessage = shouldForceMaintenance ? settings.databaseFooter : settings.developmentFooter;

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
