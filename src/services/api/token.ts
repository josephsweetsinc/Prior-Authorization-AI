import Cookies from 'js-cookie';

const ACCESS_COOKIE = 'accessToken';
const REFRESH_COOKIE = 'refreshToken';

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_COOKIE);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_COOKIE);
}

export function setTokens({
  access_token,
  refresh_token,
}: {
  access_token: string;
  refresh_token?: string;
}) {
  const isSecure =
    typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (access_token) {
    Cookies.set(ACCESS_COOKIE, access_token, {
      expires: 1,
      secure: isSecure,
      sameSite: 'Lax',
    });
  }
  if (refresh_token) {
    Cookies.set(REFRESH_COOKIE, refresh_token, {
      expires: 7,
      secure: isSecure,
      sameSite: 'Lax',
    });
  }
}

export function clearTokens() {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
}
