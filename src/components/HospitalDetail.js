// src/components/HospitalDetail.js
import React from 'react';

const HospitalDetail = ({ hospital }) => {
  return (
      <div className="hospital-detail">
        <h2>{hospital.name}</h2>
        <p>주소: {hospital.address}</p>
        <p>전화번호: {hospital.phone}</p>
        <p>전문 분야: {hospital.specialty}</p>
        {/* 추가 정보가 필요할 경우 여기에서 확장 */}
      </div>
  );
};

export default HospitalDetail;
