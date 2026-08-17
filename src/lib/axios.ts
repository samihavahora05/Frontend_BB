import Axios from 'axios';

const api = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://backend.blueboxx.in/api',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

import { getActiveRoleFromUrl, getActiveToken, clearSession } from './authUtils';

// Interceptor to attach token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = getActiveToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Public paths that should never trigger a redirect on 401
const PUBLIC_PATHS = [
    '/login',
    '/signup',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/verify-email',
    '/', // Home page
    '/internships',
    '/jobs',
    '/courses',
    '/apply',  // Application flow pages
    '/about',
    '/contact',
    '/experts',
];

// Protected portal prefixes — only these should trigger logout on 401
const PORTAL_PATHS = [
    '/student/',
    '/admin/',
    '/company/',
    '/expert/',
    '/college/',
    '/jobseeker/',
];

// Interceptor to handle global 401 Unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname;

                const isPublicPath = PUBLIC_PATHS.some(
                    (path) => currentPath === path || currentPath.startsWith(path + '/')
                );

                const isPortalPath = PORTAL_PATHS.some(
                    (path) => currentPath.startsWith(path)
                );

                // Only logout and redirect if on a portal page and it's a 401 (not authenticated)
                if (!isPublicPath && isPortalPath) {
                    if (error.response.status === 401) {
                        const activeRole = getActiveRoleFromUrl(currentPath);
                        if (activeRole !== 'public') {
                            clearSession(activeRole as string);
                        }
                        window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
