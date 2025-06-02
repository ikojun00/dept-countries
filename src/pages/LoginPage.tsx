import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../api/authService";
import Spinner from "../components/icons/Spinner";
import ErrorMessage from "../components/ErrorMessage";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await loginUser({ email, password });
      login(data.data.token);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-4 py-3 px-4 rounded-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Logging in...
              </>
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
