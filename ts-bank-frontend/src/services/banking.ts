import api from "../lib/api";

export type BVNVerificationPayload = {
  bvn: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type NINVerificationPayload = {
  nin: string;
  firstName: string;
  lastName: string;
};

export type Account = {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
  currency: string;
  status: string;
  createdAt?: string;
};

export type Transaction = {
  _id?: string;
  id?: string;
  reference?: string;
  amount?: number;
  type?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export const verifyBVN = async (
  data: BVNVerificationPayload
) => {
  const response = await api.post(
    "/onboarding/bvn",
    data
  );

  return response.data;
};

export const verifyNIN = async (
  data: NINVerificationPayload
) => {
  const response = await api.post(
    "/onboarding/nin",
    data
  );

  return response.data;
};

export const onboardingStatus = async () => {
  const response = await api.get(
    "/onboarding/status"
  );

  return response.data;
};

export const createAccount = async () => {
  const response = await api.post(
    "/accounts"
  );

  return response.data;
};

export const getMyAccount = async () => {
  const response = await api.get(
    "/accounts/me"
  );

  return response.data;
};

export const getBalance = async () => {
  const response = await api.get(
    "/accounts/balance"
  );

  return response.data;
};

export const nameEnquiry = async (
  accountNumber: string
) => {
  const response = await api.get(
    `/transfers/name-enquiry/${encodeURIComponent(
      accountNumber
    )}`
  );

  return response.data;
};

export const createTransfer = async (
  data: Record<string, unknown>
) => {
  const response = await api.post(
    "/transfers",
    data
  );

  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get(
    "/transactions"
  );

  return response.data;
};

export const getTransaction = async (
  reference: string
) => {
  const response = await api.get(
    `/transactions/${encodeURIComponent(reference)}`
  );

  return response.data;
};
