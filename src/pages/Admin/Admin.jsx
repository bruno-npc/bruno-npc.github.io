import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Container, Row, Col, Tabs, Tab, Button } from "react-bootstrap";

import "./Admin.css";

import Profile from "../../components/Profile/Profile";
import ProjectsList from "../../components/ProjectsProfile/ProjectsList";
import EducationList from "../../components/EducationProfile/EducationList";
import ExperiencesList from "../../components/ExperiencesProfile/ExperiencesList";
import SkillsList from "../../components/SkillsProfile/SkillsList";

function Admin() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("perfil");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <section className="admin-section">
      <Container className="admin-container">
        <Row className="mb-4">
          <Col className="text-center">
            <h2>Painel de Administração</h2>
            <Button variant="danger" onClick={handleLogout}>
              Sair
            </Button>
          </Col>
        </Row>

        <Tabs
          id="admin-tabs"
          activeKey={activeKey}
          onSelect={(k) => setActiveKey(k || "perfil")}
          className="admin-tabs"
        >
          <Tab eventKey="perfil" title="Perfil">
            <Profile />
          </Tab>
          <Tab eventKey="projetos" title="Projetos">
            <ProjectsList />
          </Tab>
          <Tab eventKey="educacao" title="Educação">
            <EducationList />
          </Tab>
          <Tab eventKey="experiencias" title="Experiências">
            <ExperiencesList />
          </Tab>
          <Tab eventKey="skills" title="Skills">
            <SkillsList />
          </Tab>
        </Tabs>
      </Container>
    </section>
  );
}

export default Admin;