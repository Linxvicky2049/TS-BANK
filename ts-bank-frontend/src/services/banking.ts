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

export type Balance = {
  balance: number;
};

export type VerificationResponse = {
  success: boolean;
  message: string;
  data: {
    verified: boolean;
    verificationType: "bvn" | "nin";
    verifiedAt: string;
  };
};

export type OnboardingStatus = {
  success: boolean;
  data: {
    isVerified: boolean;
    verificationType?: "bvn" | "nin";
    verifiedAt?: string;
  };
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

export type TransferPayload = {
  recipientAccountNumber?: string;
  accountNumber?: string;
  bankCode?: string;
  amount: number;
  narration?: string;
  [key: string]: unknown;
};

export const verifyBVN = async (
  data: BVNVerificationPayload
): Promise<VerificationResponse> => {
  const response =
    await api.post<VerificationResponse>(
      "/onboarding/bvn",
      data
    );

  return response.data;
};

export const verifyNIN = async (
  data: NINVerificationPayload
): Promise<VerificationResponse> => {
  const response =
    await api.post<VerificationResponse>(
      "/onboarding/nin",
      data
    );

  return response.data;
};

export const onboardingStatus =
  async (): Promise<OnboardingStatus> => {
    const response =
      await api.get<OnboardingStatus>(
        "/onboarding/status"
      );

    return response.data;
  };

export const createAccount =
  async (): Promise<Account> => {
    const response =
      await api.post<Account>("/accounts");

    return response.data;
  };

export const getMyAccount =
  async (): Promise<Account> => {
    const response =
      await api.get<Account>("/accounts/me");

    return response.data;
  };

export const getBalance =
  async (): Promise<Balance> => {
    const response =
      await api.get<Balance>(
        "/accounts/balance"
      );

    return response.data;
  };

export const nameEnquiry = async (
  accountNumber: string
): Promise<unknown> => {
  const response = await api.get(
    `/transfers/name-enquiry/${encodeURIComponent(
      accountNumber
    )}`
  );

  return response.data;
};

export const createTransfer = async (
  data: TransferPayload
): Promise<unknown> => {
  const response = await api.post(
    "/transfers",
    data
  );

  return response.data;
};

export const getTransactions =
  async (): Promise<Transaction[]> => {
    const response =
      await api.get<Transaction[]>(
        "/transactions"
      );

    return response.data;
  };

export const getTransaction = async (
  reference: string
): Promise<Transaction> => {
  const response =
    await api.get<Transaction>(
      `/transactions/${encodeURIComponent(
        reference
      )}`
    );

  return response.data;
};