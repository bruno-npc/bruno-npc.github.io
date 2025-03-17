import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  useTheme
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { SocialIcon } from "../../ui-components";

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 4,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.2)' 
          : 'rgba(0, 0, 0, 0.05)',
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            &copy; {currentYear} BS. Todos os direitos reservados.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <SocialIcon
              icon={<GitHub />}
              href="https://github.com/bruno-npc"
              tooltip="GitHub"
              color="primary"
              size="small"
            />
            
            <SocialIcon
              icon={<LinkedIn />}
              href="https://www.linkedin.com/in/bruno-npc"
              tooltip="LinkedIn"
              color="primary"
              size="small"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;