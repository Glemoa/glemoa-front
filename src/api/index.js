
import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;

// 인증이 필요없는 axios 인스턴스
const defaultInstance = axios.create({
    baseURL: API_BASE_URL,
});

// 인증이 필요한 axios 인스턴스
const authInstance = axios.create({
    baseURL: API_BASE_URL,
});

// 요청 인터셉터: 모든 요청에 accessToken을 헤더에 추가
authInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 401 에러 발생 시 토큰 재발급 시도
authInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await defaultInstance.post('/glemoa-member/member/refreshToken', { refreshToken });
                const newAccessToken = response.data.accessToken;
                localStorage.setItem('accessToken', newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return authInstance(originalRequest);
            } catch (refreshError) {
                // refreshToken이 유효하지 않을 경우 로그인 페이지로 리디렉션
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // 예를 들어 Vue Router를 사용하는 경우
                // router.push('/login');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { defaultInstance, authInstance };

