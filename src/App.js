import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import HospitalList from './components/HospitalList';
import HospitalDetail from './components/HospitalDetail';
import MapComponent from './components/MapComponent';
import Pagination from './components/Pagination';
import Login from './components/Login';
import Register from './components/Register';
import axiosInstance from './axiosInstance';
import './App.css';

function isTokenValid(token) {
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  return payload.exp > currentTime; // 토큰 만료 시간과 현재 시간 비교
}

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && isTokenValid(token)) {
      setIsLoggedIn(true);
    } else {
      localStorage.clear();
      setIsLoggedIn(false);
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setMapCenter(location);
        },
        (error) => {
          const defaultLocation = { latitude: 37.5665, longitude: 126.9780 };
          setMapCenter(defaultLocation);
        },
        { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const response = await axiosInstance.get('/hospitals/search', {
        params: { name: searchTerm },
      });
      if (response.data.length > 0) {
        const targetHospital = response.data[0];
        setSelectedHospital(targetHospital);
        setMapCenter({
          latitude: targetHospital.latitude,
          longitude: targetHospital.longitude,
        });
      } else {
        alert('검색 결과가 없습니다.');
      }
    } catch (error) {
      console.error('병원 검색 실패:', error);
    }
  };

  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    setMapCenter({
      latitude: hospital.latitude,
      longitude: hospital.longitude,
    });
  };

  return (
      <Router>
        <div className="app-container">
          <Header
              isLoggedIn={isLoggedIn}
              onLogout={() => {
                localStorage.clear();
                setIsLoggedIn(false);
              }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              setSelectedHospital={setSelectedHospital}
          />
          <Routes>
            <Route
                path="/"
                element={
                  <div className="content-container">
                    <div className="sidebar">
                      <CategoryFilter />
                      <HospitalList
                          hospitals={hospitals.slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage
                          )}
                          setSelectedHospital={handleHospitalClick}
                          selectedHospital={selectedHospital}
                      />
                      <Pagination
                          currentPage={currentPage}
                          totalItems={hospitals.length}
                          itemsPerPage={itemsPerPage}
                          onPageChange={setCurrentPage}
                      />
                    </div>
                    <div className="map-container">
                      <MapComponent
                          hospitals={hospitals}
                          mapCenter={mapCenter}
                          setMapCenter={setMapCenter}
                          setHospitals={setHospitals}
                          setSelectedHospital={setSelectedHospital}
                          selectedHospital={selectedHospital}
                      />
                    </div>
                    {selectedHospital && (
                        <HospitalDetail
                            hospital={selectedHospital}
                            onClose={() => setSelectedHospital(null)}
                        />
                    )}
                  </div>
                }
            />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
