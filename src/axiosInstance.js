// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // API 기본 URL 설정
});

// 요청 시, 토큰을 자동으로 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 시, 인증 오류(401)가 발생할 경우 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        alert("인증이 만료되었습니다. 다시 로그인해 주세요.");
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; // 로그인 페이지로 이동
      }
      return Promise.reject(error);
    }
);

export default axiosInstance;
