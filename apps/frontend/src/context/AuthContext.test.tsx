import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthService } from '@/services/Authservice';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import { useEffect } from 'react';

vi.mock('react-cookie', () => {
  const mockGet = vi.fn();
  
  return {
    Cookies: class {
      get = mockGet;
      set = vi.fn();
      remove = vi.fn();
    },
    __mocks: { mockGet }
  };
});

type ReactCookieMock = { __mocks: { mockGet: ReturnType<typeof vi.fn> } };
const { mockGet } = (vi.mocked(await import('react-cookie')) as unknown as ReactCookieMock).__mocks;

vi.mock('@/services/Authservice', () => ({
  AuthService: {
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}));

vi.mock('@/api/axiosInstance', () => ({
  default: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const TestComponent = () => {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
      <div data-testid="loading-status">{isLoading ? 'Loading...' : 'Not loading'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it('should initially not be authenticated', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });

  it('should login successfully', async () => {
    const mockResponse = {
      access_token: 'mock-access-token',
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['user'],
      },
    };
    (AuthService.login as MockedFunction<typeof AuthService.login>).mockResolvedValueOnce(mockResponse);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle login errors', async () => {
    const error = new Error('Login failed');
    (AuthService.login as MockedFunction<typeof AuthService.login>).mockRejectedValueOnce(error);

    const LoginErrorTestComponent = () => {
      const { isAuthenticated, login } = useAuth();
      
      useEffect(() => {
        const tryLogin = async () => {
          try {
            await login('test@example.com', 'password');
          } catch {
            /* Error ignored - only testing side effects */
          }
        };
        
        tryLogin();
      }, [login]);
      
      return (
        <div>
          <div data-testid="auth-status">
            {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </div>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginErrorTestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
    });

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
  });

  it('should logout successfully', async () => {
    (AuthService.logout as MockedFunction<typeof AuthService.logout>).mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const mockResponse = {
      access_token: 'mock-access-token',
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['user'],
      },
    };
    (AuthService.login as MockedFunction<typeof AuthService.login>).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });

    expect(AuthService.logout).toHaveBeenCalled();
  });

  it('should automatically refresh token if present', async () => {
    mockGet.mockReturnValue('mock-refresh-token');
    (AuthService.refresh as MockedFunction<typeof AuthService.refresh>).mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AuthService.refresh).toHaveBeenCalled();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
}); 