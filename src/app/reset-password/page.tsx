"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const identifier = searchParams.get("identifier");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, identifier, password }),
    });

    setLoading(false);
    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
    } else {
      setError(data.error);
    }
  };

  useEffect(() => {
    if (!token || !identifier) {
      setError("Missing token or identifier.");
    }
  }, [token, identifier]);

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {token && identifier ? (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <p style={{ color: "red" }}>Invalid reset link.</p>
      )}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
