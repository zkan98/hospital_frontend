import React, { useEffect, useRef, useCallback, useState } from 'react';
import axiosInstance from '../axiosInstance';

const MapComponent = ({ hospitals, mapCenter, setMapCenter, setHospitals, setSelectedHospital, selectedHospital }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);

  // 오류 방지를 위한 기본값
  const defaultCenter = { latitude: 37.5665, longitude: 126.9788 }; // 서울의 기본 좌표 (예시)

  // 지도 초기화
  const initializeMap = useCallback(() => {
    if (!mapCenter) return; // mapCenter가 없으면 초기화하지 않음

    // mapCenter가 있을 때만 실행
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
        fetchHospitals(newCenter.latitude, newCenter.longitude); // 새로운 위치에서 병원 데이터 로드
      });
    }
  }, [mapCenter, setMapCenter]);

  // 병원 마커 추가
  const addHospitalMarkers = useCallback(
      (hospitalData) => {
        if (!mapRef.current) return;

        // 기존 마커 삭제
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];

        hospitalData.forEach((hospital) => {
          // 병원의 위도와 경도가 존재할 때만 마커 추가
          if (hospital.latitude && hospital.longitude) {
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
          }
        });
      },
      [selectedHospital]
  );

  // InfoWindow 표시
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
      mapRef.current.setCenter(marker.getPosition());
    }
  };

  // 병원 정보 가져오기
  const fetchHospitals = async (latitude, longitude) => {
    try {
      const response = await axiosInstance.get(
          `/hospitals/nearby?latitude=${latitude}&longitude=${longitude}`
      );
      setHospitals(response.data);
    } catch (error) {
      console.error('병원 데이터 가져오기 실패:', error);
      alert('병원 데이터를 가져오는 데 실패했습니다.');
    }
  };

  // 초기 맵과 병원 데이터 로드
  useEffect(() => {
    if (mapCenter?.latitude && mapCenter?.longitude) {
      initializeMap();
      fetchHospitals(mapCenter.latitude, mapCenter.longitude);
    } else {
      // mapCenter가 없으면 기본 위치(서울)로 설정
      setMapCenter(defaultCenter);
      fetchHospitals(defaultCenter.latitude, defaultCenter.longitude);
    }
  }, [initializeMap, mapCenter, setMapCenter]);

  // 병원 데이터에 따라 마커 업데이트
  useEffect(() => {
    if (hospitals && hospitals.length > 0) {
      addHospitalMarkers(hospitals);
    }
  }, [hospitals, addHospitalMarkers]);

  return (
      <div id="map" style={{ width: '100%', height: '500px' }}>
        {/* 지도 표시를 위한 div */}
      </div>
  );
};

export default MapComponent;
