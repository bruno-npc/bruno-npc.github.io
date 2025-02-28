import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Education.css";

function Education() {
  const [educations, setEducations] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState(null);

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "educations"));
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setEducations(list);

      // Seleciona a primeira, se existir
      if (list.length > 0) {
        setSelectedEducation(list[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar educations (público):", error);
    }
  };

  // Formata data "YYYY-MM-DD" para "DD/MM/YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Monta o período
  const getPeriod = (edu) => {
    const start = formatDate(edu.startDate);
    const end = edu.endDate ? formatDate(edu.endDate) : "Atual";
    if (!start) return "";
    return `${start} - ${end}`;
  };

  const renderDetails = (edu) => {
    if (edu.type === "Graduação") {
      return <p>{edu.details}</p>;
    } else {
      // Tenta dividir por vírgula
      const items = edu.details ? edu.details.split(",") : [];
      return (
        <ul>
          {items.map((item, idx) => (
            <li key={idx}>{item.trim()}</li>
          ))}
        </ul>
      );
    }
  };

  return (
    <section id="education" className="education-section">
      <div className="education-container">
        <div className="education-list">
          <h2>Educação</h2>
          {educations.map((edu) => (
            <div
              key={edu.id}
              className={`education-item ${
                selectedEducation && selectedEducation.id === edu.id
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedEducation(edu)}
            >
              <h3>{edu.name}</h3>
              <span>{getPeriod(edu)}</span>
            </div>
          ))}
        </div>

        {selectedEducation && (
          <div className="education-details">
            <h3>{selectedEducation.name}</h3>
            <p>
              <strong>Período:</strong> {getPeriod(selectedEducation)}
            </p>
            {renderDetails(selectedEducation)}

            {selectedEducation.link && (
              <a
                href={selectedEducation.link}
                target="_blank"
                rel="noreferrer"
              >
                <button className="btn btn-primary">Acessar Cursos</button>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Education;