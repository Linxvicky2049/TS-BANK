import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import Field from "../components/Field";
import Status from "../components/Status";

import {
  verifyBVN,
  verifyNIN,
} from "../services/banking";

export default function Onboarding() {
  const [type, setType] =
    useState<"BVN" | "NIN">("BVN");

  const [id, setId] = useState("");
  const [firstName, setFirstName] =
    useState("");
  const [lastName, setLastName] =
    useState("");
  const [phone, setPhone] =
    useState("");

  const [error, setError] =
    useState("");
  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (type === "BVN") {
        await verifyBVN({
          bvn: id,
          firstName,
          lastName,
          phone,
        });

        setSuccess(
          "BVN verification successful. You can now create your bank account."
        );
      } else {
        await verifyNIN({
          nin: id,
          firstName,
          lastName,
        });

        setSuccess(
          "NIN verification successful. You can now create your bank account."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "KYC verification failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function changeType(
    nextType: "BVN" | "NIN"
  ) {
    setType(nextType);
    setId("");
    setError("");
    setSuccess("");
  }

  return (
    <div className="page narrow">
      <div>
        <small>CUSTOMER ONBOARDING</small>

        <h2>KYC verification</h2>

        <p>
          Verify your identity using the BVN or
          NIN test credentials provided by the
          NibssByPhoenix environment.
        </p>
      </div>

      <div className="card">
        <div className="choices">
          <button
            type="button"
            className={
              type === "BVN"
                ? "selected"
                : ""
            }
            onClick={() => changeType("BVN")}
          >
            BVN
          </button>

          <button
            type="button"
            className={
              type === "NIN"
                ? "selected"
                : ""
            }
            onClick={() => changeType("NIN")}
          >
            NIN
          </button>
        </div>

        <form onSubmit={submit}>
          <Field
            label="First name"
            value={firstName}
            onChange={(event) =>
              setFirstName(event.target.value)
            }
            required
          />

          <Field
            label="Last name"
            value={lastName}
            onChange={(event) =>
              setLastName(event.target.value)
            }
            required
          />

          <Field
            label={type === "BVN" ? "BVN" : "NIN"}
            value={id}
            onChange={(event) =>
              setId(
                event.target.value.replace(
                  /\D/g,
                  ""
                )
              )
            }
            inputMode="numeric"
            maxLength={11}
            minLength={11}
            required
          />

          {type === "BVN" && (
            <Field
              label="Phone number"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              required
            />
          )}

          <Status text={error} />

          <Status
            text={success}
            success
          />

          <button
            className="primary full"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : `Verify ${type}`}
          </button>
        </form>

        <p className="hint">
          After verification,{" "}
          <Link to="/account">
            create your bank account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
