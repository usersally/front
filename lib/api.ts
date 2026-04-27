// the place for all calls to node.js and backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//successeful auth request from backend
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    userName: string;
    email: string;
  };
}

//error response from backend
export interface ApiError {
  message: string;
}

// helpers
async function post<T>(endpoint: string, body: object): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Conntent-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  //backend error message
  if (!res.ok) {
    throw new Error((data as ApiError).message ?? "Something went wrong");
  }

  return data as T;
}

// auth API calls
// /auth/login. (matches all routes that check email, psw in mongodb)
export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>("/auth/login", { email, password });
}

// /auth/register  (matches all routes that create new user in mongodb)

export async function registerUser(
  userName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return post<AuthResponse>("/auth/register", { userName, email, password });
}

// save the jwt to localstorage after login/register successfuly

export function saveToken(token: string): void {
  localStorage.setItem("token", token);
}

// read jwt (when making auth requests)
export function getToken(): string | null {
  return localStorage.getItem("token");
}

// remove jwt (when logout)
export function clearToken(): void {
  localStorage.removeItem("token");
}
