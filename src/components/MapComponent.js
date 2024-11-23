import React, { useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../axiosInstance';

const MapComponent = ({ hospitals, mapCenter, setMapCenter, setHospitals, setSelectedHospital, selectedHospital }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  const initializeMap = useCallback(() => {
    if (!mapCenter) return;

    if (!mapRef.current) {
      mapRef.current = new window.naver.maps.Map('map', {
        center: new window.naver.maps.LatLng(mapCenter.latitude, mapCenter.longitude),
        zoom: 15,
      });

      // 지도 드래그 종료 후 이벤트
      window.naver.maps.Event.addListener(mapRef.current, 'dragend', () => {
        const center = mapRef.current.getCenter();
        const newCenter = { latitude: center.lat(), longitude: center.lng() };
        setMapCenter(newCenter);
        fetchHospitals(newCenter.latitude, newCenter.longitude);
      });
    }
  }, [mapCenter, setMapCenter]);

  const addHospitalMarkers = useCallback(
      (hospitalData) => {
        if (!mapRef.current) return;

        // 기존 마커 삭제
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        hospitalData.forEach((hospital) => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(hospital.latitude, hospital.longitude),
            map: mapRef.current,
            title: hospital.name,
          });

          // 마커 클릭 이벤트 추가
          window.naver.maps.Event.addListener(marker, 'click', () => {
            displayInfoWindow(marker, hospital);
          });

          marker.hospitalId = hospital.id; // 마커에 병원 ID 저장
          markersRef.current.push(marker);

          // 선택된 병원과 일치하면 InfoWindow 표시
          if (selectedHospital && selectedHospital.id === hospital.id) {
            displayInfoWindow(marker, hospital, false); // 드래그를 방지
          }
        });
      },
      [selectedHospital]
  );

  const displayInfoWindow = (marker, hospital, shouldMoveCenter = true) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const infoWindow = new window.naver.maps.InfoWindow({
      content: `<div style="padding:5px; font-size:14px; background-color:white; border:1px solid #ddd; border-radius:4px;">${hospital.name}</div>`,
    });

    infoWindow.open(mapRef.current, marker);
    infoWindowRef.current = infoWindow;

    if (shouldMoveCenter) {
      // 지도 중심을 마커 위치로 이동
      const markerPosition = marker.getPosition();
      mapRef.current.setCenter(markerPosition);
    }

    setSelectedHospital(hospital);
  };

  const fetchHospitals = async (latitude, longitude) => {
    try {
      const response = await axiosInstance.get('/hospitals/nearby', {
        params: { latitude, longitude },
      });
      const hospitalData = response.data;
      setHospitals(hospitalData);
      addHospitalMarkers(hospitalData);
    } catch (error) {
      console.error('병원 데이터 가져오기 실패:', error.response || error.message);
    }
  };

  useEffect(() => {
    initializeMap();
    if (mapRef.current && mapCenter) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(mapCenter.latitude, mapCenter.longitude));
    }
  }, [initializeMap, mapCenter]);

  useEffect(() => {
    if (hospitals) {
      addHospitalMarkers(hospitals);
    }
  }, [hospitals, addHospitalMarkers]);

  return <div id="map" style={{ width: '100%', height: '100%' }} />;
};

export default MapComponent;
