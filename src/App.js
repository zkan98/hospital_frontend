import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import HospitalList from './components/HospitalList';
import HospitalDetail from './components/HospitalDetail';
import MapComponent from './components/MapComponent';
import axios from 'axios';
import './App.css';

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // 사용자 위치 가져오기
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setUserLocation({ latitude, longitude });
    }, (error) => {
      console.error('Error getting location:', error);
    });

    // 초기 병원 목록 불러오기
    fetchHospitals();
  }, []);

  const fetchHospitals = () => {
    axios
    .get(`http://localhost:8080/api/hospitals`)
    .then((response) => setHospitals(response.data))
    .catch((error) => console.error('Error fetching hospital data:', error));
  };

  const filteredHospitals = selectedCategory
      ? hospitals.filter((hospital) => hospital.specialty === selectedCategory)
      : hospitals;

  return (
      <div className="app-container">
        <Header />
        <div className="main-content">
          <div className="hospital-list-container">
            <CategoryFilter
                categories={['전체', '내과', '외과']}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            <HospitalList
                hospitals={filteredHospitals}
                setSelectedHospital={setSelectedHospital}
            />
          </div>
          <div className="hospital-details-container">
            {selectedHospital && <HospitalDetail hospital={selectedHospital} />}
          </div>
        </div>
        <MapComponent hospitals={filteredHospitals} userLocation={userLocation} setSelectedHospital={setSelectedHospital} />
      </div>
  );
}

export default App;
