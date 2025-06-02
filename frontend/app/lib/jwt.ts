import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function getUserRole(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

export function isAdmin(token: string): boolean {
  const role = getUserRole(token);
  return role === "Admin";
}
