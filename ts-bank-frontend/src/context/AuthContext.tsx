import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import api, { msg } from "../lib/api";

export type User = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  phone?: string;
  isVerified?: boolean;
  verificationType?: string;
  dateOfBirth?: string;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  register: (
    payload: Record<string, unknown>
  ) => Promise<void>;
  logout: () => void;
};

const Auth =
  createContext<AuthContextType | null>(null);

const unwrap = (data: any) =>
  data?.data ?? data;

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem(
        "ts_bank_token"
      )
    );

  const [user, setUser] =
    useState<User | null>(() => {
      const stored =
        localStorage.getItem(
          "ts_bank_user"
        );

      if (!stored) {
        return null;
      }

      try {
        return JSON.parse(stored);
      } catch {
        localStorage.removeItem(
          "ts_bank_user"
        );

        return null;
      }
    });

  async function login(
    email: string,
    password: string
  ) {
    try {
      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const body =
        unwrap(response.data);

      const jwt =
        body?.token ||
        body?.accessToken;

      if (!jwt) {
        throw new Error(
          "No JWT token returned by server"
        );
      }

      const authenticatedUser =
        body?.user ||
        body?.customer ||
        null;

      localStorage.setItem(
        "ts_bank_token",
        jwt
      );

      if (authenticatedUser) {
        localStorage.setItem(
          "ts_bank_user",
          JSON.stringify(
            authenticatedUser
          )
        );
      }

      setToken(jwt);
      setUser(authenticatedUser);
    } catch (error) {
      throw new Error(
        msg(error, "Login failed")
      );
    }
  }

  async function register(
    payload: Record<string, unknown>
  ) {
    try {
      const response =
        await api.post(
          "/auth/register",
          payload
        );

      const body =
        unwrap(response.data);

      const jwt =
        body?.token ||
        body?.accessToken;

      const registeredUser =
        body?.user ||
        body?.customer ||
        null;

      if (jwt) {
        localStorage.setItem(
          "ts_bank_token",
          jwt
        );

        setToken(jwt);
      }

      if (registeredUser) {
        localStorage.setItem(
          "ts_bank_user",
          JSON.stringify(
            registeredUser
          )
        );

        setUser(registeredUser);
      }
    } catch (error) {
      throw new Error(
        msg(error, "Registration failed")
      );
    }
  }

  function logout() {
    localStorage.removeItem(
      "ts_bank_token"
    );

    localStorage.removeItem(
      "ts_bank_user"
    );

    setToken(null);
    setUser(null);
  }

  return (
    <Auth.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  );
}

export const useAuth = () => {
  const context =
    useContext(Auth);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
