// src/components/HospitalList.js
import React from 'react';
import HospitalCard from './HospitalCard';

const HospitalList = ({ hospitals, setSelectedHospital }) => {
  return (
      <div className="hospital-list">
        {hospitals.map((hospital) => (
            <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onClick={() => setSelectedHospital(hospital)} // 클릭 시 병원 선택
            />
        ))}
      </div>
  );
};

export default HospitalList;
