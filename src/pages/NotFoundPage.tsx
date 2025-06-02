import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl sm:text-8xl font-bold text-blue-600">404</h1>
      <h2 className="text-2xl sm:text-4xl font-semibold text-black">
        Page Not Found
      </h2>
      <p className="text-slate-600 max-w-md">
        Oops! The page you're looking for doesn't exist. It might have been
        moved, deleted or perhaps you mistyped the URL.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold mt-4 py-3 px-4 rounded-lg flex items-center justify-center"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
