import React from "react";

interface PageHeaderProps {
  handleLogout: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ handleLogout }) => {
  return (
    <header className="bg-gradient-to-b from-cyan-800 to-blue-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Countries</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
