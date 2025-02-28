import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-section">
      <p>&copy; 2025 BS. Todos os direitos reservados.</p>
      <p>
        <a
          href="https://github.com/bruno-npc"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>{" "}
        |{" "}
        <a
          href="https://www.linkedin.com/in/bruno-npc"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}

export default Footer;