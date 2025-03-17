import React, { useState } from "react";
import {
  FaJava,
  FaReact,
  FaAngular,
  FaPython,
  FaDocker,
  FaJenkins,
  FaDatabase,
  FaCuttlefish,
} from "react-icons/fa";
import {
  SiSpringboot,
  SiKubernetes,
  SiPostgresql,
  SiLiquibase,
  SiTypescript,
  SiTailwindcss,
} from "react-icons/si";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  useTheme,
  IconButton,
  Tooltip
} from "@mui/material";
import { Section } from "../../ui-components";

const skillsData = [
  {
    name: "Java",
    icon: <FaJava />,
    description: "Java é uma linguagem orientada a objetos usada em aplicações backend.",
  },
  {
    name: "Spring Boot e Microsserviços",
    icon: <SiSpringboot />,
    description:
      "Spring Boot é um framework para aplicações Java robustas e escaláveis. " +
      "Microsserviços são uma arquitetura que permite aplicações modulares e de fácil manutenção.",
  },
  {
    name: "Python",
    icon: <FaPython />,
    description: "Linguagem versátil usada em automação, IA e desenvolvimento backend.",
  },
  {
    name: "C# (Unity3D)",
    icon: <FaCuttlefish />,
    description: "C# é utilizado no desenvolvimento de jogos e aplicações com Unity3D.",
  },
  {
    name: "Kubernetes",
    icon: <SiKubernetes />,
    description: "Orquestração de contêineres para escalabilidade e gerenciamento.",
  },
  {
    name: "React",
    icon: <FaReact />,
    description: "Biblioteca JavaScript para interfaces de usuário dinâmicas.",
  },
  {
    name: "Angular",
    icon: <FaAngular />,
    description: "Framework frontend para criar SPAs e aplicações escaláveis.",
  },
  {
    name: "TypeScript",
    icon: <SiTypescript />,
    description: "JavaScript com tipagem estática para maior segurança e robustez.",
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss />,
    description: "Framework CSS para interfaces modernas e responsivas.",
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql />,
    description: "Banco de dados relacional escalável e open source.",
  },
  {
    name: "MSSQL",
    icon: <FaDatabase />,
    description: "Banco de dados da Microsoft para aplicações empresariais.",
  },
  {
    name: "Liquibase",
    icon: <SiLiquibase />,
    description: "Ferramenta para automação de versionamento de banco de dados.",
  },
  {
    name: "Docker",
    icon: <FaDocker />,
    description: "Contêineres para empacotar e distribuir aplicações.",
  },
  {
    name: "Jenkins e CI/CD",
    icon: <FaJenkins />,
    description:
      "Jenkins permite automação de pipelines de CI/CD para integração e entrega contínua. " +
      "CI/CD envolve processos para entrega contínua e automação de deploys.",
  },
];

function Skills() {
  const [selectedSkill, setSelectedSkill] = useState(0);
  const theme = useTheme();

  return (
    <Section 
      id="skills" 
      title="Conhecimentos"
      bgColor={theme.palette.background.default}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              height: '100%',
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.3s ease',
            }}
          >
            <Typography variant="h5" component="h3" gutterBottom>
              {skillsData[selectedSkill].name}
            </Typography>
            <Typography variant="body1">
              {skillsData[selectedSkill].description}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2
            }}
          >
            {skillsData.map((skill, index) => {
              const isSelected = index === selectedSkill;

              return (
                <Tooltip key={index} title={skill.name} arrow>
                  <IconButton
                    onClick={() => setSelectedSkill(index)}
                    sx={{
                      width: 60,
                      height: 60,
                      fontSize: '1.8rem',
                      color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                      backgroundColor: isSelected 
                        ? theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
                      border: isSelected 
                        ? `2px solid ${theme.palette.primary.main}` 
                        : `2px solid transparent`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {skill.icon}
                  </IconButton>
                </Tooltip>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </Section>
  );
}

export default Skills;