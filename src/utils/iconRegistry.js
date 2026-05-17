import {
  FaAngular,
  FaAws,
  FaCuttlefish,
  FaDatabase,
  FaDocker,
  FaHtml5,
  FaJava,
  FaJenkins,
  FaNodeJs,
  FaPython,
  FaReact,
  FaVuejs,
} from "react-icons/fa";
import {
  SiKubernetes,
  SiLiquibase,
  SiPostgresql,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

export const iconMap = {
  FaAngular,
  FaAws,
  FaCuttlefish,
  FaDatabase,
  FaDocker,
  FaHtml5,
  FaJava,
  FaJenkins,
  FaNodeJs,
  FaPython,
  FaReact,
  FaVuejs,
  SiKubernetes,
  SiLiquibase,
  SiPostgresql,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
};

export const iconNames = Object.keys(iconMap).sort();

export const getIconComponent = (iconName) => iconMap[iconName] || null;
