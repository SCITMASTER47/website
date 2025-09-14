export interface UserSignUpRequest {
  email: string;
  password: string;
}
export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface Session {
  id: string;
  email: string;
}
export interface JWT {
  accessToken: string;
}
