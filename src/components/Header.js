import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

const Header = ({ isLoggedIn, onLogout, searchTerm, setSearchTerm, onSearch, setSelectedHospital }) => {
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axiosInstance.get('/hospitals/search', {
        params: { name: query },
      });
      const uniqueSuggestions = Array.from(new Map(response.data.map((item) => [item.id, item])).values());
      setSuggestions(uniqueSuggestions.slice(0, 15));
    } catch (error) {
      console.error('검색 제안 가져오기 실패:', error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (hospital) => {
    setSearchTerm(hospital.name);
    setSuggestions([]);
    setSelectedHospital(hospital);
    onSearch(hospital.latitude, hospital.longitude);
  };

  return (
      <header>
        <h1
            onClick={() => (window.location.href = '/')}
        >
          힐스팟
        </h1>
        <div className="search-bar">
          <input
              type="text"
              placeholder="병원 검색"
              value={searchTerm || ''}
              onChange={handleInputChange}
          />
          <button onClick={() => onSearch()}>검색</button>
          {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((hospital) => (
                    <li
                        key={hospital.id}
                        onClick={() => handleSuggestionClick(hospital)}
                        style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ddd' }}
                    >
                      {hospital.name}
                    </li>
                ))}
              </ul>
          )}
        </div>
        <div className="user-profile">
          {isLoggedIn ? (
              <button onClick={onLogout} style={{ padding: '5px 10px' }}>
                로그아웃
              </button>
          ) : (
              <>
                <button onClick={() => (window.location.href = '/login')} style={{ padding: '5px 10px' }}>
                  로그인
                </button>
                <button onClick={() => (window.location.href = '/register')} style={{ padding: '5px 10px' }}>
                  회원가입
                </button>
              </>
          )}
        </div>
      </header>
  );
};

export default Header;
