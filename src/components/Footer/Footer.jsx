import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { SocialIcon } from "../../ui-components";
import { doc, getDoc } from "firebase/firestore";
import { db, reportDatabaseUnavailable } from "../../firebaseConfig";
import { DEFAULT_SITE_SETTINGS, getSiteSettings } from "../../services/siteSettings";

function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(DEFAULT_SITE_SETTINGS);
  const [socialLinks, setSocialLinks] = useState({});

  useEffect(() => {
    getSiteSettings().then(setSettings);

    const fetchProfile = async () => {
      try {
        if (!db) {
          throw new Error("Firebase indisponível.");
        }

        const snap = await getDoc(doc(db, "profileData", "meuPerfil"));
        if (snap.exists()) {
          setSocialLinks(snap.data().socialLinks || {});
        }
      } catch (error) {
        console.error("Erro ao buscar links do rodapé:", error);
        reportDatabaseUnavailable(error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: theme.palette.mode === "dark"
          ? "rgba(0, 0, 0, 0.2)"
          : "rgba(0, 0, 0, 0.05)",
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            &copy; {currentYear} {settings.footer.copyrightName}. Todos os direitos reservados.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            {socialLinks.github && (
              <SocialIcon
                icon={<GitHub />}
                href={socialLinks.github}
                tooltip="GitHub"
                color="primary"
                size="small"
              />
            )}

            {socialLinks.linkedin && (
              <SocialIcon
                icon={<LinkedIn />}
                href={socialLinks.linkedin}
                tooltip="LinkedIn"
                color="primary"
                size="small"
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
