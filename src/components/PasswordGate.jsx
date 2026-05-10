import React, { useEffect, useState } from "react";

export default function PasswordGate({ children }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] =
    useState(false);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    verifyExistingToken();
  }, []);

  const verifyExistingToken = async () => {
    const token =
      localStorage.getItem("auth_token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/bypass/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setAuthenticated(true);
      } else {
        localStorage.removeItem(
          "auth_token"
        );
      }
    } catch {
      localStorage.removeItem(
        "auth_token"
      );
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/bypass/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      localStorage.setItem(
        "auth_token",
        data.token
      );

      setAuthenticated(true);
    } catch (err) {
      setError(
        err.message ||
          "Wrong password"
      );
    }
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        Loading...
      </div>
    );
  }

  if (authenticated) {
    return children;
  }

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ width: 350 }}
      >
        <h3 className="text-center mb-3">
          Enter Password
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {error && (
            <p className="text-danger text-center">
              {error}
            </p>
          )}

          <button className="btn btn-primary w-100">
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}