import React, { useState, useRef } from "react";
import { 
  Grid, 
  Paper, 
  Box,
  useTheme,
  Snackbar,
  Alert
} from "@mui/material";
import { Email, Person, Message } from "@mui/icons-material";
import { Section, TextField, Button } from "../../ui-components";
import emailjs from '@emailjs/browser';

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const formRef = useRef();
  const theme = useTheme();

  const handleChange = (e) => {
    const fieldMap = {
      user_name: 'name',
      user_email: 'email',
      message: 'message'
    };
    
    const stateField = fieldMap[e.target.name] || e.target.name;
    setFormData((prev) => ({ ...prev, [stateField]: e.target.value }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Substitua estes valores pelos seus IDs do EmailJS
      const serviceId = 'service_id'; // Seu Service ID do EmailJS
      const templateId = 'template_id'; // Seu Template ID do EmailJS
      const publicKey = 'public_key'; // Sua Public Key do EmailJS
      
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );
      
      console.log('Email enviado com sucesso!', result.text);
      setSnackbar({
        open: true,
        message: 'Mensagem enviada com sucesso! Entrarei em contato em breve.',
        severity: 'success'
      });
      
      // Limpar o formulário após o envio bem-sucedido
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section 
      id="contact" 
      title="Contato"
      subtitle="Entre em contato comigo para discutir projetos ou oportunidades"
      bgColor={theme.palette.background.default}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <form ref={formRef} onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Nome"
                  name="user_name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  startIcon={<Person />}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="E-mail"
                  name="user_email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  startIcon={<Email />}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  label="Mensagem"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  startIcon={<Message />}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  loading={loading}
                >
                  Enviar
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Section>
  );
}

export default Contact;