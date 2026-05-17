import { doc, getDoc } from "firebase/firestore";
import { db, reportDatabaseUnavailable } from "../firebaseConfig";

export const DEFAULT_SITE_SETTINGS = {
  navbar: {
    brand: "Portfolio",
    home: "Início",
    skills: "Conhecimentos",
    experiences: "Experiências",
    education: "Estudos",
    projects: "Projetos",
    contact: "Contato",
    login: "Login",
    admin: "Admin",
    logout: "Logout",
  },
  maintenance: {
    developmentTitle: "Site em Desenvolvimento",
    developmentMessage:
      "Obrigado por visitar! Este site está atualmente em fase de manutenção e desenvolvimento. Algumas funcionalidades podem não estar completas ou podem apresentar comportamentos inesperados.",
    developmentFooter: "Agradecemos sua compreensão enquanto trabalhamos para melhorar sua experiência.",
    databaseTitle: "Site em Manutenção",
    databaseMessage:
      "Estou reconstruindo a base de dados do portfólio. Algumas seções podem aparecer vazias ou temporariamente indisponíveis.",
    databaseFooter: "Volte em breve para ver os projetos, experiências e demais informações atualizadas.",
  },
  contact: {
    title: "Contato",
    subtitle: "Entre em contato comigo para discutir projetos ou oportunidades",
    successMessage: "Mensagem enviada com sucesso! Entrarei em contato em breve.",
    errorMessage: "Erro ao enviar mensagem. Por favor, tente novamente mais tarde.",
    emailJsServiceId: "",
    emailJsTemplateId: "",
    emailJsPublicKey: "",
  },
  footer: {
    copyrightName: "BS",
  },
};

const mergeSettings = (settings = {}) => ({
  navbar: { ...DEFAULT_SITE_SETTINGS.navbar, ...(settings.navbar || {}) },
  maintenance: { ...DEFAULT_SITE_SETTINGS.maintenance, ...(settings.maintenance || {}) },
  contact: { ...DEFAULT_SITE_SETTINGS.contact, ...(settings.contact || {}) },
  footer: { ...DEFAULT_SITE_SETTINGS.footer, ...(settings.footer || {}) },
});

export const getSiteSettings = async () => {
  if (!db) {
    reportDatabaseUnavailable(new Error("Firebase indisponível."));
    return DEFAULT_SITE_SETTINGS;
  }

  try {
    const snap = await getDoc(doc(db, "siteSettings", "main"));
    return snap.exists() ? mergeSettings(snap.data()) : DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("Erro ao buscar configurações do site:", error);
    reportDatabaseUnavailable(error);
    return DEFAULT_SITE_SETTINGS;
  }
};
