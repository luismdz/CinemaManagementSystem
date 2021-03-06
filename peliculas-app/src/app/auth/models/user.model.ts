export interface User {
  name?: string;
  email: string;
  password?: string;
  token?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}
