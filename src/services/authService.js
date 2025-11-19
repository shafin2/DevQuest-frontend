import api from '../lib/api';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  // Signup (Local)
  signup: async (data) => {
    const response = await axios.post(
      `${API_URL}/auth/signup`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-platform': 'web',
        },
      }
    );
    return response.data;
  },

  // Email Verification
  verifyEmail: async (token) => {
    const response = await axios.get(
      `${API_URL}/auth/verify-email/${token}`
    );
    return response.data;
  },

  // Login (Local)
  login: async (email, password) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
        platform: 'web',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-platform': 'web',
        },
      }
    );
    return response.data;
  },

  // Google OAuth Login
  googleLogin: async (token, role = 'client') => {
    const response = await axios.post(
      `${API_URL}/auth/google`,
      {
        token,
        role,
        platform: 'web',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-platform': 'web',
        },
      }
    );
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      { refreshToken }
    );
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await axios.post(
      `${API_URL}/auth/forgot-password`,
      { email }
    );
    return response.data;
  },

  // Reset Password
  resetPassword: async (token, password) => {
    const response = await axios.post(
      `${API_URL}/auth/reset-password/${token}`,
      { password }
    );
    return response.data;
  },

  // Logout
  logout: async (refreshToken) => {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      { refreshToken }
    );
    return response.data;
  },

  // Resend Verification Email (if backend supports it)
  resendVerificationEmail: async (email) => {
    const response = await axios.post(
      `${API_URL}/auth/resend-verification`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-platform': 'web',
        },
      }
    );
    return response.data;
  },
};
