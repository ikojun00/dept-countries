import React from "react";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <p className="mb-4 text-red-600 text-sm bg-red-100 p-3 rounded-md border border-red-300">
      {error}
    </p>
  );
};

export default ErrorMessage;
