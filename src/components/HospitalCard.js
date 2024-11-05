// src/components/HospitalCard.js
import React from 'react';

const HospitalCard = ({ hospital, onClick }) => {
  return (
      <div className="hospital-card" onClick={onClick}>
        <h3>{hospital.name}</h3>
        <p>{hospital.address}</p>
        <p>전문 분야: {hospital.specialty}</p>
      </div>
  );
};

export default HospitalCard;
