// the place for all calls to node.js and backend
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─────────────────────────────────────────────
//  AXIOS INSTANCE
// ─────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT automatically to every request if present
api.interceptors.request.use((config) => {
  try {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return config;
});

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

// Successful auth response from backend
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      _id: string;
      email: string;
      role: "student" | "teacher" | "admin";
      firstName: string;
      lastName: string;
    };
  };
}

export type AuthUser = AuthResponse["data"]["user"];

// Payload sent to /auth/register
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  CV?: string;
}

// Error response from backend
export interface ApiError {
  message: string;
}

// Platform-wide stats returned by /admin/stats
export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
}

// A user record as returned by /admin/users
export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: "student" | "teacher" | "admin";
  createdAt?: string;
  CV?: string;
}

// A course record as returned by /admin/courses
export interface AdminCourse {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  published: boolean;
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
  } | null;
  studentsCount?: number;
  createdAt?: string;
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/** Extracts a readable message from an Axios error */
export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  return (
    axiosError.response?.data?.message ??
    axiosError.message ??
    "Something went wrong"
  );
}

// ─────────────────────────────────────────────
//  AUTH API
// ─────────────────────────────────────────────

// POST /auth/login
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return data;
}

// POST /auth/register
export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

// ─────────────────────────────────────────────
//  ADMIN API
// ─────────────────────────────────────────────

// GET /admin/stats
export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<{ success: boolean; data: AdminStats }>(
    "/admin/dashboard",
  );
  return data.data;
}

// GET /admin/users
export async function getUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<{ success: boolean; data: AdminUser[] }>(
    "/admin/users",
  );
  return data.data;
}

// PATCH /admin/users/:id/role
export async function updateUserRole(
  userId: string,
  role: AdminUser["role"],
): Promise<AdminUser> {
  const { data } = await api.patch<{ success: boolean; data: AdminUser }>(
    `/admin/users/${userId}/role`,
    { role },
  );
  return data.data;
}

// DELETE /admin/users/:id
export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`);
}

// GET /admin/courses
export async function getAllCourses(): Promise<AdminCourse[]> {
  const { data } = await api.get<{ success: boolean; data: AdminCourse[] }>(
    "/admin/courses",
  );
  return data.data;
}

// DELETE /admin/courses/:id
export async function deleteCourse(courseId: string): Promise<void> {
  await api.delete(`/admin/courses/${courseId}`);
}

// ─────────────────────────────────────────────
//  TOKEN HELPERS
//  Sessions last 7 days.
// ─────────────────────────────────────────────

const TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "token_expiry";
const SESSION_DAYS = 7;

/**
 * Persist a JWT together with an absolute expiry timestamp.
 * Call this immediately after a successful login/register.
 */
export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  // Expiry = now + 7 days (in ms)
  const expiry = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry));
}

/**
 * Return the stored JWT if it exists and has not expired.
 * If the token is expired, all auth data is cleared and null is returned
 * so the Axios interceptor will not attach a stale token.
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (expiry && Date.now() > Number(expiry)) {
    // Token has expired — wipe everything and force re-login
    clearToken();
    clearUser();
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Remove the token and its expiry from localStorage.
 */
export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// ─────────────────────────────────────────────
//  USER HELPERS
// ─────────────────────────────────────────────

export function saveUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  // If the token is gone (expired/logged-out) don't return a stale user
  if (!getToken()) return null;
  const user = localStorage.getItem("user");
  return user ? (JSON.parse(user) as AuthUser) : null;
}

export function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
}

// ─────────────────────────────────────────────
//  AUTH LOGOUT
// ─────────────────────────────────────────────

export function logout(): void {
  clearToken();
  clearUser();
}
