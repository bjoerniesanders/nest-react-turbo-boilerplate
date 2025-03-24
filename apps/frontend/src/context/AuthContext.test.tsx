import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthService } from '@/services/Authservice';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockRemove = vi.fn();

// Mock react-cookie
vi.mock('react-cookie', () => ({
  Cookies: class {
    get = mockGet;
    set = mockSet;
    remove = mockRemove;
  },
}));

// Mock AuthService
vi.mock('@/services/Authservice', () => ({
  AuthService: {
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
}));

// Mock axiosInstance
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
      <div data-testid="auth-status">{isAuthenticated ? 'Authentifiziert' : 'Nicht authentifiziert'}</div>
      <div data-testid="loading-status">{isLoading ? 'Lädt...' : 'Nicht lädt'}</div>
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

  it('sollte initial nicht authentifiziert sein', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Nicht authentifiziert');
  });

  it('sollte erfolgreich einloggen', async () => {
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['user'],
      },
    };
    (AuthService.login as any).mockResolvedValueOnce(mockResponse);

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
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authentifiziert');
    });

    expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('sollte Fehler beim Login behandeln', async () => {
    const error = new Error('Login fehlgeschlagen');
    (AuthService.login as any).mockRejectedValueOnce(error);

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
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Nicht authentifiziert');
    });
  });

  it('sollte erfolgreich ausloggen', async () => {
    (AuthService.logout as any).mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Erst einloggen
    const mockResponse = {
      user: {
        id: 1,
        email: 'test@example.com',
        roles: ['user'],
      },
    };
    (AuthService.login as any).mockResolvedValueOnce(mockResponse);

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authentifiziert');
    });

    // Dann ausloggen
    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Nicht authentifiziert');
    });

    expect(AuthService.logout).toHaveBeenCalled();
  });

  it('sollte automatisch Token erneuern wenn vorhanden', async () => {
    // Mock Cookie mit Token
    mockGet.mockReturnValue('mock-refresh-token');
    (AuthService.refresh as any).mockResolvedValueOnce(undefined);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(AuthService.refresh).toHaveBeenCalled();
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authentifiziert');
    });
  });
}); 