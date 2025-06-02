import React from "react";
import type { ViewMode } from "../../types";

interface ViewModeControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  savedCountriesCount: number;
}

const ViewModeControls: React.FC<ViewModeControlsProps> = ({
  viewMode,
  setViewMode,
  savedCountriesCount,
}) => {
  const buttonClass = (mode: ViewMode) =>
    `px-4 py-2 rounded-lg text-sm sm:text-base font-medium ${
      viewMode === mode
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setViewMode("all")}
          className={buttonClass("all")}
        >
          All Sections
        </button>
        <button
          onClick={() => setViewMode("fetch")}
          className={buttonClass("fetch")}
        >
          Fetch Countries
        </button>
        <button
          onClick={() => setViewMode("saved")}
          className={buttonClass("saved")}
        >
          Saved Countries ({savedCountriesCount})
        </button>
      </div>
    </div>
  );
};

export default ViewModeControls;
