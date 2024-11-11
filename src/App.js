import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

function App() {
  const [hospitals, setHospitals] = useState([]);
  const [displayedHospitals, setDisplayedHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  });
  const itemsPerPage = 10;
  const categories = ['전체', '내과', '외과', '정형외과', '피부과'];

  // 위치 설정
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ latitude: 37.5665, longitude: 126.9780 }); // 서울을 기본 위치로 설정
        }
    );
  }, []);

  // 병원과 리뷰 데이터 가져와 평균 평점 추가
  // App.js
  const fetchHospitalsWithRatings = async (latitude, longitude) => {
    try {
      const response = await axiosInstance.get('/hospitals/nearby', {
        params: { latitude, longitude },
      });
      const hospitalsData = response.data.slice(0, 40);

      // 병원마다 리뷰를 가져와 평균 평점 계산
      const hospitalsWithRatings = await Promise.all(
          hospitalsData.map(async (hospital) => {
            try {
              const reviewsResponse = await axiosInstance.get(`/reviews/hospital/${hospital.id}`);
              const reviews = reviewsResponse.data;
              const averageRating = reviews.length
                  ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                  : null;
              return { ...hospital, averageRating };
            } catch (error) {
              console.error(`Error fetching reviews for hospital ${hospital.id}:`, error);
              return { ...hospital, averageRating: null };
            }
          })
      );

      setHospitals(hospitalsWithRatings);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
  };

  // 병원 데이터와 위치 정보에 따른 업데이트
  useEffect(() => {
    if (userLocation) {
      fetchHospitalsWithRatings(userLocation.latitude, userLocation.longitude);
    }
  }, [userLocation, tokens.accessToken]);

  // 로그인 및 로그아웃 핸들러
  const handleLogin = (newTokens) => {
    setTokens(newTokens);
    localStorage.setItem('accessToken', newTokens.accessToken);
    localStorage.setItem('refreshToken', newTokens.refreshToken);
  };

  const handleLogout = () => {
    setTokens({ accessToken: null, refreshToken: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // 카테고리 필터링
  const filteredHospitals = selectedCategory
      ? hospitals.filter((hospital) => hospital.specialty === selectedCategory)
      : hospitals;

  // 페이지네이션 적용된 병원 리스트
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedHospitals(filteredHospitals.slice(startIndex, endIndex));
  }, [filteredHospitals, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
      <Router>
        <div className="app-container">
          <Header isLoggedIn={!!tokens.accessToken} onLogout={handleLogout} />
          <Routes>
            <Route
                path="/"
                element={
                  <div className="content-container">
                    <div className="sidebar">
                      <CategoryFilter
                          categories={categories}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                      />
                      <div className="list-container">
                        <HospitalList
                            hospitals={displayedHospitals}
                            setSelectedHospital={setSelectedHospital}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredHospitals.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />
                      </div>
                    </div>
                    <div className="map-container">
                      <MapComponent
                          hospitals={filteredHospitals.slice(0, 40)}
                          setHospitals={setHospitals}
                          userLocation={userLocation}
                          setSelectedHospital={setSelectedHospital}
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
            <Route path="/login" element={<Login setTokens={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
