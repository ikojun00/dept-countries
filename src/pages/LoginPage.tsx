import React, { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../api/authService";
import Spinner from "../components/icons/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { LOGIN } from "../constants/login";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const clearLockout = () => {
    localStorage.removeItem(LOGIN.LOGIN_LOCKOUT_UNTIL_KEY);
    localStorage.removeItem(LOGIN.FAILED_ATTEMPTS_COUNT_KEY);
    setIsLockedOut(false);
    setError(null);
  };

  const checkLockoutStatus = () => {
    const lockoutUntil = localStorage.getItem(LOGIN.LOGIN_LOCKOUT_UNTIL_KEY);
    if (!lockoutUntil) return;

    const lockoutEndTime = parseInt(lockoutUntil);
    if (Date.now() >= lockoutEndTime) {
      clearLockout();
      return;
    }

    setIsLockedOut(true);
    const remainingMinutes = Math.ceil(
      (lockoutEndTime - Date.now()) / 1000 / 60
    );
    setError(
      `Too many failed login attempts. Please try again in ${remainingMinutes} minute(s).`
    );

    setTimeout(clearLockout, lockoutEndTime - Date.now());
  };

  useEffect(() => {
    checkLockoutStatus();
    window.addEventListener("storage", checkLockoutStatus);
    return () => window.removeEventListener("storage", checkLockoutStatus);
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (isLockedOut) return;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data.data.token);
      clearLockout();
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred during login.";
      setError(errorMessage);

      const attempts =
        parseInt(localStorage.getItem(LOGIN.FAILED_ATTEMPTS_COUNT_KEY) || "0") +
        1;

      if (attempts >= LOGIN.MAX_LOGIN_ATTEMPTS) {
        const lockoutEndTime = Date.now() + LOGIN.LOGIN_LOCKOUT_DURATION_MS;
        localStorage.setItem(
          LOGIN.LOGIN_LOCKOUT_UNTIL_KEY,
          lockoutEndTime.toString()
        );
        localStorage.setItem(LOGIN.FAILED_ATTEMPTS_COUNT_KEY, "0");
        checkLockoutStatus();
      } else
        localStorage.setItem(
          LOGIN.FAILED_ATTEMPTS_COUNT_KEY,
          attempts.toString()
        );
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || isLockedOut;

  return (
    <div className="flex px-4 items-center justify-center min-h-screen bg-gradient-to-b from-cyan-800 to-blue-800">
      <div className="p-8 bg-white shadow-2xl rounded-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h2>
        {error && <ErrorMessage error={error} />}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-800"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2.5 border border-gray-800 rounded-lg"
              placeholder="your.email@example.com"
              disabled={isSubmitDisabled}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2.5 border border-gray-800 rounded-lg"
              placeholder="••••••••"
              disabled={isSubmitDisabled}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`font-semibold mt-4 py-3 px-4 rounded-lg flex items-center justify-center ${
              isLockedOut
                ? "bg-gray-300 text-gray-500"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Logging in...
              </>
            ) : isLockedOut ? (
              "Locked Out"
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
