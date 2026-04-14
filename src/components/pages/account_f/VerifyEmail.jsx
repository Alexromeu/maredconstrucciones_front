import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./CreateAccount.css";

export default function VerifyEmail() {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [state, setState] = useState({ status: "pending", message: "Verifying your email..." });
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setState({ status: "success", message: "Email verified! You can now sign in." });
      } else {
        setState({ status: "error", message: result.error || "Verification failed." });
      }
    })();
  }, [token, verifyEmail]);

  return (
    <div className="create-account-container">
      <h2>Email Verification</h2>
      <p className="status-msg">{state.message}</p>
      {state.status === "success" && (
        <p className="auth-swap">
          <Link to="/signin">Go to sign in</Link>
        </p>
      )}
      {state.status === "error" && (
        <p className="auth-swap">
          <Link to="/signin">Back to sign in</Link>
        </p>
      )}
    </div>
  );
}
