import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Experiences.css";

function Experiences() {
  const [experiences, setExperiences] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "experiences"));
      const expList = [];
      querySnapshot.forEach((docSnap) => {
        expList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setExperiences(expList);

      if (expList.length > 0) {
        setSelectedExperience(expList[0]);
      }
    } catch (error) {
      console.error("Erro ao buscar experiências:", error);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getPeriod = (exp) => {
    const start = formatDate(exp.startDate);
    const end = exp.endDate ? formatDate(exp.endDate) : "Atual";
    if (!start) return "";
    return `${start} - ${end}`;
  };

  return (
    <section id="experiences" className="experiences-section">
      <div className="experiences-container">
        <div className="experiences-list">
          <h2>Experiências</h2>
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className={`experience-item ${
                selectedExperience && selectedExperience.id === exp.id
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedExperience(exp)}
            >
              <h3>{exp.company}</h3>
              <p>{exp.role}</p>
              <span>{getPeriod(exp)}</span>
            </div>
          ))}
        </div>
        {selectedExperience && (
          <div className="experiences-details">
            <h3>
              {selectedExperience.role} - {selectedExperience.company}
            </h3>
            <p>
              <strong>Período:</strong> {getPeriod(selectedExperience)}
            </p>
            <p>{selectedExperience.details}</p>
            <p>
              <strong>Stacks: </strong>
              {Array.isArray(selectedExperience.stacks)
                ? selectedExperience.stacks.join(", ")
                : ""}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Experiences;