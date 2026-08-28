import api from "../lib/api";

export type KycType = "BVN" | "NIN";

export interface BvnVerificationData {
  bvn: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface NinVerificationData {
  nin: string;
  firstName: string;
  lastName: string;
}

export interface OnboardingStatus {
  status?: string;
  bvnVerified?: boolean;
  ninVerified?: boolean;
  verified?: boolean;
  [key: string]: unknown;
}

const unwrap = <T>(response: { data: T }): T => response.data;

export const verifyBvn = async (
  data: BvnVerificationData
) => {
  const response = await api.post(
    "/onboarding/bvn",
    data
  );

  return unwrap(response);
};

export const verifyNin = async (
  data: NinVerificationData
) => {
  const response = await api.post(
    "/onboarding/nin",
    data
  );

  return unwrap(response);
};

export const getOnboardingStatus =
  async (): Promise<OnboardingStatus> => {
    const response = await api.get(
      "/onboarding/status"
    );

    return unwrap(response);
  };
