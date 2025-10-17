// admin/preview-templates/DoctorPreview.js
import React from "react";

const DoctorPreview = ({ entry }) => {
  const name = entry.getIn(["data", "name"]);
  const position = entry.getIn(["data", "position"]);
  const specialization = entry.getIn(["data", "specialization"]);
  const experience = entry.getIn(["data", "experience"]);
  const photo = entry.getIn(["data", "photo"]);

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "1rem",
      maxWidth: "300px",
      fontFamily: "sans-serif",
      background: "#fff"
    }}>
      <img
        src={photo}
        alt={name}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "50%",
          marginBottom: "1rem"
        }}
      />
      <h3 style={{ margin: "0 0 0.5rem" }}>{name}</h3>
      <p><strong>Посада:</strong> {position}</p>
      <p><strong>Спеціалізація:</strong> {specialization}</p>
      <p><strong>Стаж:</strong> {experience}</p>
    </div>
  );
};

export default DoctorPreview;
