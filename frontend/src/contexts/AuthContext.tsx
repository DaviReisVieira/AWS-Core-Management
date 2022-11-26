import jwtDecode from "jwt-decode";
import Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { createContext, ReactChild, useEffect, useState } from "react";
import { api } from "../services/api";

interface AuthProviderProps {
  children: ReactChild;
}

interface SignInData {
  username: string;
  password: string;
}

interface RegisterData extends SignInData {
  aws_access_key_id: string;
  aws_secret_key: string;
}

export type User = {
  username: string;
};

type AuthContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: User;
  isAuthenticated: boolean;
  signIn: (data: SignInData) => Promise<any>;
  logOut: () => Promise<void>;
  registerUser: (data: RegisterData) => Promise<any>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const { "awsCoreManagement.accessToken": accessToken } = parseCookies();

    if (accessToken) {
      api.defaults.headers.Authorization = `Bearer ${accessToken}`;

      const { username }: any = jwtDecode(accessToken);

      setUser({ username: username });
    }
  }, []);

  async function signIn({ username, password }: SignInData) {
    try {
      const response = await api.post("login", {
        username,
        password,
      });

      const { access_token } = response.data;

      setCookie(undefined, "awsCoreManagement.accessToken", access_token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      api.defaults.headers["Authorization"] = `Bearer ${access_token}`;

      setUser({ username });

      Router.push("/dashboard");
    } catch (error: Error | any) {
      return error.response;
    }
  }

  async function logOut() {
    setUser(null);
    setCookie(undefined, "awsCoreManagement.accessToken", "", {
      maxAge: 0,
    });
    Router.push("/");
  }

  async function refreshToken() {
    try {
      const response = await api.post("refresh");

      const { access_token } = response.data;

      setCookie(undefined, "awsCoreManagement.accessToken", access_token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      api.defaults.headers["Authorization"] = `Bearer ${access_token}`;
    } catch (error: Error | any) {
      return error.response;
    }
  }

  async function registerUser({
    username,
    password,
    aws_secret_key,
    aws_access_key_id,
  }: RegisterData) {
    try {
      const response = await api.post("register", {
        username,
        password,
        aws_secret_key,
        aws_access_key_id,
      });

      return response;
    } catch (error: Error | any) {
      return error.response;
    }
  }

  return (
    <AuthContext.Provider
      value={
        {
          loading,
          setLoading,
          user,
          signIn,
          logOut,
          registerUser,
        } as AuthContextType
      }
    >
      {children}
    </AuthContext.Provider>
  );
}
