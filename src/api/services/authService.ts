import apiClient from '../clients/apiClient';
import type { AuthResponse, LoginCredentials, SignupData } from '../types/auth.types';

export const login = async (data: LoginCredentials): Promise<AuthResponse> => {
  // ReqRes login endpoint: POST /api/login
  const response = await apiClient.post('/api/login', data);
  // Simulate user data since ReqRes only returns a token
  return {
    user: {
      id: 'mock-user-id',
      email: data.email,
    },
    token: response.data.token,
  };
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  // ReqRes register endpoint: POST /api/register
  const response = await apiClient.post('/api/register', {
    email: data.email,
    password: data.password,
  });
  // Simulate user data with name
  return {
    user: {
      id: 'mock-user-id',
      email: data.email,
      name: data.name,
    },
    token: response.data.token,
  };
};
