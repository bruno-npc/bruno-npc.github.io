import React, { useState, useEffect } from "react";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Hero.css";
import profilePic from "../../assets/perfil.jpeg";

function Hero() {
  const [showAbout, setShowAbout] = useState(false);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const ref = doc(db, "profileData", "meuPerfil");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setAboutTitle(data.aboutTitle || "");
          setAboutSubtitle(data.aboutSubtitle || "");
          setAboutDescription(data.aboutDescription || "");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    };
    fetchProfileData();
  }, []);

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-container container">
        <div className="hero-text">
          <h1>{aboutTitle}</h1>
          <p>{aboutSubtitle}</p>

          <div className="hero-buttons">
            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "#contact")}
            >
              Contate-me
            </button>

            <button className="btn btn-primary" onClick={toggleAbout}>
              {showAbout ? "Ocultar" : "Sobre Mim"}
            </button>

            <div className={`about-me-absolute ${showAbout ? "show" : ""}`}>
              <p>{aboutDescription}</p>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img src={profilePic} alt="Bruno" className="hero-image" />

          <a
            href="https://github.com/bruno-npc"
            target="_blank"
            rel="noreferrer"
            className="orbit-icon orbit-github"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/bruno-npc"
            target="_blank"
            rel="noreferrer"
            className="orbit-icon orbit-linkedin"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.instagram.com/bruno_npc"
            target="_blank"
            rel="noreferrer"
            className="orbit-icon orbit-instagram"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;