import { useCallback, useEffect, useState } from "react";
import { Copy } from "lucide-react";

import { createAccount, getMyAccount } from "../services/banking";
import Status from "../components/Status";

interface BankAccount {
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;

    return (
      apiError.response?.data?.message ||
      apiError.message ||
      fallback
    );
  }

  return fallback;
}

export default function Account() {
  const [account, setAccount] = useState<BankAccount | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAccount = useCallback(async () => {
    try {
      setError("");

      const data = await getMyAccount();

      setAccount(data);
    } catch (error: unknown) {
      setError(
        getErrorMessage(error, "Account not found")
      );
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  async function handleCreateAccount() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await createAccount();

      setAccount(data);
      setSuccess("Account created successfully.");
    } catch (error: unknown) {
      setError(
        getErrorMessage(
          error,
          "Account creation failed"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAccountNumber() {
    if (!account?.accountNumber) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        account.accountNumber
      );

      setSuccess("Account number copied.");
    } catch {
      setError("Unable to copy account number.");
    }
  }

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <small>BANK ACCOUNT</small>

          <h2>My account</h2>

          <p>
            Your personal TS Bank account details.
          </p>
        </div>
      </div>

      <Status text={error} />
      <Status text={success} success />

      {account ? (
        <article className="bankcard">
          <small>TS BANK · ACTIVE</small>

          <span>ACCOUNT NUMBER</span>

          <strong>{account.accountNumber}</strong>

          <div className="details">
            <div>
              ACCOUNT NAME
              <b>{account.accountName}</b>
            </div>

            <div>
              BALANCE
              <b>
                ₦
                {Number(account.balance || 0).toLocaleString()}
              </b>
            </div>

            <div>
              CURRENCY
              <b>{account.currency}</b>
            </div>
          </div>

          <button
            type="button"
            onClick={copyAccountNumber}
          >
            <Copy size={15} />
            Copy account number
          </button>
        </article>
      ) : (
        <div className="card empty">
          <h3>No account found</h3>

          <p>
            Complete KYC verification before creating
            an account.
          </p>

          <button
            type="button"
            className="primary"
            onClick={handleCreateAccount}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create bank account"}
          </button>
        </div>
      )}
    </div>
  );
}