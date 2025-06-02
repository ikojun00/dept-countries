import React from "react";
import type { CountryItem } from "../../types";
import CountryListItem from "./CountryListItem";

interface SavedSectionProps {
  savedCountries: CountryItem[];
  handleRemoveCountry: (countryCode: string) => void;
  showFetchSectionHint: boolean;
}

const SavedSection: React.FC<SavedSectionProps> = ({
  savedCountries,
  handleRemoveCountry,
  showFetchSectionHint,
}) => {
  return (
    <section className="flex flex-col gap-6 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
        My Saved Countries List ({savedCountries.length})
      </h2>
      {savedCountries.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {savedCountries.map((country) => (
            <CountryListItem
              key={`saved-${country.code}`}
              country={country}
              actionButton={
                <button
                  onClick={() => handleRemoveCountry(country.code)}
                  className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white text-center text-sm font-medium py-1.5 px-4 rounded-md"
                >
                  &times; Remove
                </button>
              }
            />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">
          Your list is empty.{" "}
          {showFetchSectionHint
            ? "Fetch and save some countries to get started!"
            : "Switch to 'All Sections' or 'Fetch Countries' to fetch countries."}
        </p>
      )}
    </section>
  );
};

export default SavedSection;
