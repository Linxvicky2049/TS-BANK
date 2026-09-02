import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import {
  getMyAccount,
  getBalance,
} from "../services/banking";
import { useAuth } from "../context/AuthContext";
import Status from "../components/Status";

interface BankAccount {
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
}

interface Balance {
  balance: number;
}

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export default function Dashboard() {
  const { user } = useAuth();

  const [account, setAccount] =
    useState<BankAccount | null>(null);

  const [balance, setBalance] =
    useState<Balance | null>(null);

  const [error, setError] = useState("");

  const loadAccountData = useCallback(async () => {
    try {
      setError("");

      const [accountData, balanceData] =
        await Promise.all([
          getMyAccount(),
          getBalance(),
        ]);

      setAccount(accountData);
      setBalance(balanceData);
    } catch {
      setError("Could not load account data.");
    }
  }, []);

  useEffect(() => {
    void loadAccountData();
  }, [loadAccountData]);

  return (
    <div className="page">
      <div className="pagehead">
        <div>
          <small>OVERVIEW</small>

          <h2>
            Good to see you,{" "}
            {user?.fullName?.split(" ")[0] ||
              "Customer"}
            .
          </h2>

          <p>
            Your banking workspace is ready.
          </p>
        </div>

        <Link
          className="primary"
          to="/transfer"
        >
          <ArrowUpRight size={17} />
          Send money
        </Link>
      </div>

      <Status text={error} />

      <div className="stats">
        <article className="featured">
          <small>AVAILABLE BALANCE</small>

          <strong>
            {balance
              ? money.format(balance.balance)
              : "₦ —"}
          </strong>

          <span>
            {account?.accountNumber ||
              "No account yet"}
          </span>
        </article>

        <article>
          <CreditCard />

          <small>ACCOUNT</small>

          <strong>
            {account?.accountNumber ||
              "Not created"}
          </strong>
        </article>

        <article>
          <ShieldCheck />

          <small>VERIFICATION</small>

          <strong>
            {user?.isVerified
              ? "Verified"
              : "Pending"}
          </strong>
        </article>
      </div>

      <div className="card">
        <small>QUICK ACTIONS</small>

        <div className="actions">
          <Link to="/name-enquiry">
            <strong>Name enquiry</strong>
            <span>Verify a recipient</span>
          </Link>

          <Link to="/transfer">
            <strong>Transfer</strong>
            <span>Send funds</span>
          </Link>

          <Link to="/transactions">
            <strong>Transactions</strong>
            <span>View your history</span>
          </Link>
        </div>
      </div>
    </div>
  );
}