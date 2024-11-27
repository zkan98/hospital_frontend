import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// 요청 시 액세스 토큰 추가
axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// 리프레시 토큰 요청 함수
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axiosInstance.post('/users/refresh', { refreshToken });
    const { accessToken: newAccessToken } = response.data;

    // 새 액세스 토큰 저장
    localStorage.setItem('accessToken', newAccessToken);

    // Axios 인스턴스의 기본 헤더 업데이트
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error('리프레시 토큰 갱신 실패:', error);
    throw error;
  }
}

// 응답 시 토큰 만료 처리
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 토큰 만료 시
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('리프레시 실패. 다시 로그인 필요:', refreshError);
          localStorage.clear(); // 토큰 초기화
          window.location.href = '/login'; // 로그인 페이지로 이동
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
);

export default axiosInstance;
