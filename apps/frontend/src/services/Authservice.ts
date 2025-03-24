import axiosInstance from "@/api/axiosInstance";

interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    roles: string[];
  };
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email,
        password,
      }, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful, tokens should be in cookies');
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  refresh: async (): Promise<void> => {
    try {
      console.log('Attempting to refresh token...');
      await axiosInstance.post('/auth/refresh', {}, { 
        withCredentials: true,
        headers: {
          'X-Skip-Interceptor': 'true',
          'Content-Type': 'application/json'
        }
      });
      console.log('Token refresh successful');
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },

  getUserProfile: async () => {
    const response = await axiosInstance.get('/auth/profile', { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout', {}, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

  