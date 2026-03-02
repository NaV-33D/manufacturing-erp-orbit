import { apiRequest } from './http';

export const loginUser = (payload) => apiRequest('/auth/login', { method: 'POST', body: payload });

export const registerUser = (payload) => apiRequest('/auth/register', { method: 'POST', body: payload });

export const fetchProfile = (token) => apiRequest('/auth/profile', { token });

export const refreshToken = (token) => apiRequest('/auth/refresh', { method: 'POST', token });
