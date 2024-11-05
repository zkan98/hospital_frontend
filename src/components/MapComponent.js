import React, { useEffect, useRef } from 'react';

const MapComponent = ({ hospitals, userLocation, setSelectedHospital }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const initializeMap = (latitude, longitude) => {
    mapRef.current = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(latitude, longitude),
      zoom: 15,
    });
  };

  const addHospitalMarkers = (hospitalData) => {
    if (!mapRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 최대 40개의 병원 마커 추가
    hospitalData.slice(0, 40).forEach((hospital) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(hospital.latitude, hospital.longitude),
        map: mapRef.current,
        title: hospital.name,
      });

      // 마커 클릭 시 병원 정보 표시
      window.naver.maps.Event.addListener(marker, 'click', () => {
        setSelectedHospital(hospital);
      });

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    // 사용자 위치가 있을 경우 지도 초기화 및 마커 추가
    if (userLocation && window.naver && window.naver.maps) {
      initializeMap(userLocation.latitude, userLocation.longitude);
      addHospitalMarkers(hospitals);
    } else {
      // 네이버 지도 API 로드
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        if (userLocation) {
          initializeMap(userLocation.latitude, userLocation.longitude);
          addHospitalMarkers(hospitals);
        }
      };
      document.head.appendChild(script);
    }
  }, [userLocation, hospitals, initializeMap, addHospitalMarkers]); // 종속성 배열 수정

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;
