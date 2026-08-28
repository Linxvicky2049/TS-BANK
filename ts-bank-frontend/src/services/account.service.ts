import api from "../lib/api";

export interface Account {
  accountNumber?: string;
  accountName?: string;
  balance?: number;
  bankName?: string;
  status?: string;
  [key: string]: unknown;
}

const unwrap = <T>(response: { data: T }): T => response.data;

export const createAccount = async () => {
  const response = await api.post("/accounts");

  return unwrap(response);
};

export const getMyAccount = async (): Promise<Account> => {
  const response = await api.get("/accounts/me");

  return unwrap(response);
};

export const getBalance = async () => {
  const response = await api.get("/accounts/balance");

  return unwrap(response);
};
