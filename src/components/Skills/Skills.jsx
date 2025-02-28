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
import "./Skills.css";

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

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        <div className="skills-left">
          <h2>Conhecimentos</h2>
          <div className="skill-details">
            <h3>{skillsData[selectedSkill].name}</h3>
            <p>{skillsData[selectedSkill].description}</p>
          </div>
        </div>
        <div className="skills-right">
          {skillsData.map((skill, index) => {
            const isSelected = index === selectedSkill;

            return (
              <div
                key={index}
                className={`skill-icon-container ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedSkill(index)}
                title={skill.name}
              >
                <span className="skill-icon">{skill.icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;