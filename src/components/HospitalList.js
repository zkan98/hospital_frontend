// HospitalList.js
import React from 'react';
import HospitalCard from './HospitalCard';

const HospitalList = ({ hospitals, setSelectedHospital }) => {
  return (
      <div style={{ padding: '10px' }}>
        {hospitals.map((hospital) => (
            <HospitalCard
                key={hospital.id}
                hospital={hospital}
                onClick={() => setSelectedHospital(hospital)}
            />
        ))}
      </div>
  );
};

export default HospitalList;
