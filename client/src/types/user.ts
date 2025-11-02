export interface User {
  id: string;
  email: string;
  displayName: string;
  token: string;
  imageUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}