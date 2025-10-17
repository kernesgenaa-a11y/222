import React from "react";

const DoctorPreview = ({ entry, widgetFor }) => {
  const name = entry.getIn(["data", "name"]);
  const position = entry.getIn(["data", "position"]);
  const specialization = entry.getIn(["data", "specialization"]);
  const experience = entry.getIn(["data", "experience"]);
  const photo = entry.getIn(["data", "photo"]);

  return (
    <div className="doctor-card">
      <img src={photo} alt={name} style={{ width: "150px", borderRadius: "50%" }} />
      <h3>{name}</h3>
      <p><strong>Посада:</strong> {position}</p>
      <p><strong>Спеціалізація:</strong> {specialization}</p>
      <p><strong>Стаж:</strong> {experience}</p>
    </div>
  );
};

export default DoctorPreview;
