export interface AuthConfig {
  jwt: {
    accessToken: {
      secret: string;
      expiresIn: string;
    };
    refreshToken: {
      secret: string;
      expiresIn: string;
    };
  };
  cookies: {
    accessToken: {
      name: string;
      maxAge: number;
    };
    refreshToken: {
      name: string;
      maxAge: number;
    };
    options: {
      httpOnly: boolean;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
      path: string;
    };
  };
}

export const authConfig = (): AuthConfig => ({
  jwt: {
    accessToken: {
      secret:
        typeof process.env.JWT_SECRET === 'string' && process.env.JWT_SECRET !== ''
          ? process.env.JWT_SECRET
          : 'fallback_secret',
      expiresIn: '1h',
    },
    refreshToken: {
      secret:
        typeof process.env.JWT_REFRESH_SECRET === 'string' && process.env.JWT_REFRESH_SECRET !== ''
          ? process.env.JWT_REFRESH_SECRET
          : 'fallback_refresh_secret',
      expiresIn: '7d',
    },
  },
  cookies: {
    accessToken: {
      name: 'access_token',
      maxAge: 60 * 60 * 1000,
    },
    refreshToken: {
      name: 'refresh_token',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    },
  },
});
