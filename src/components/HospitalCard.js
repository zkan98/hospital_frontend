import React from 'react';

const HospitalCard = ({ hospital, onClick }) => {
  return (
      <div className="hospital-card" onClick={onClick}>
        <h3>{hospital.name}</h3>
        <p>{hospital.address}</p>
        <p>전문 분야: {hospital.specialtyKorean}</p>
        <p>총 평점: {hospital.averageRating ? `${hospital.averageRating} / 5` : "평점 없음"}</p>
      </div>
  );
};

export default HospitalCard;
