// components/MapComponent.js

import React, { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const MapComponent = ({ hospitals, setHospitals, userLocation, setSelectedHospital }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null); // InfoWindow 상태 관리

  const initializeMap = useCallback((latitude, longitude) => {
    mapRef.current = new window.naver.maps.Map('map', {
      center: new window.naver.maps.LatLng(latitude, longitude),
      zoom: 15,
    });

    window.naver.maps.Event.addListener(mapRef.current, 'dragend', () => {
      const center = mapRef.current.getCenter();
      fetchHospitals(center.lat(), center.lng());
    });
  }, []);

  const addHospitalMarkers = useCallback((hospitalData) => {
    if (!mapRef.current) return;

    // 기존 마커 초기화
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 병원 데이터로 마커 생성
    hospitalData.forEach((hospital) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(hospital.latitude, hospital.longitude),
        map: mapRef.current,
        title: hospital.name,
      });

      // 마커 클릭 이벤트
      window.naver.maps.Event.addListener(marker, 'click', () => {
        // 이전 InfoWindow가 열려있다면 닫기
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }

        // 새로운 InfoWindow 생성 및 열기
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding:5px; font-size:14px;">${hospital.name}</div>`,
          borderColor: '#333',
          borderWidth: 1,
          disableAutoPan: true,
          backgroundColor: '#fff',
        });
        infoWindow.open(mapRef.current, marker);
        infoWindowRef.current = infoWindow; // 현재 InfoWindow 저장

        // 선택된 병원 정보 업데이트
        setSelectedHospital(hospital);
      });

      markersRef.current.push(marker);
    });
  }, [setSelectedHospital]);

  const fetchHospitals = useCallback((latitude, longitude) => {
    axios.get(`http://localhost:8080/api/hospitals/nearby`, {
      params: { latitude, longitude }
    })
    .then((response) => {
      setHospitals(response.data.slice(0, 40));
    })
    .catch((error) => console.error("Error fetching hospital data:", error));
  }, [setHospitals]);

  useEffect(() => {
    if (userLocation) {
      initializeMap(userLocation.latitude, userLocation.longitude);
      fetchHospitals(userLocation.latitude, userLocation.longitude);
    } else {
      const script = document.createElement('script');
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        if (window.naver && window.naver.maps) {
          initializeMap(37.5665, 126.9780); // Default location (Seoul)
          fetchHospitals(37.5665, 126.9780);
        } else {
          console.error("네이버 지도 API를 로드하는 데 실패했습니다.");
        }
      };
      script.onerror = () => {
        console.error("네이버 지도 API 스크립트를 로드할 수 없습니다.");
      };
      document.head.appendChild(script);
    }
  }, [userLocation, initializeMap, fetchHospitals]);

  useEffect(() => {
    addHospitalMarkers(hospitals);
  }, [hospitals, addHospitalMarkers]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
