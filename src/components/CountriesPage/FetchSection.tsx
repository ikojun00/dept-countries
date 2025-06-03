import React from "react";
import type { CountryItem } from "../../types";
import Spinner from "../icons/Spinner";
import CountryListItem from "./CountryListItem";

interface FetchSectionProps {
  fetchLimit: number;
  setFetchLimit: (value: number) => void;
  handleFetchCountries: () => void;
  isLoading: boolean;
  fetchedCountries: CountryItem[];
  handleSaveCountry: (country: CountryItem) => void;
  isCountrySaved: (countryCode: string) => boolean;
  isFetchButtonDisabled: boolean;
}

const FetchSection: React.FC<FetchSectionProps> = ({
  fetchLimit,
  setFetchLimit,
  handleFetchCountries,
  isLoading,
  fetchedCountries,
  handleSaveCountry,
  isCountrySaved,
  isFetchButtonDisabled,
}) => {
  return (
    <section className="flex flex-col gap-6 py-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
        Fetch New Countries
      </h2>
      <div className="flex gap-2 flex-col items-start">
        <label
          htmlFor="fetchLimit"
          className="text-sm font-medium text-gray-600"
        >
          Number to fetch (1-10):
        </label>
        <input
          type="number"
          id="fetchLimit"
          value={fetchLimit}
          onChange={(e) => setFetchLimit(Number(e.target.value))}
          min="1"
          max="10"
          className="w-24 p-2 border rounded-md sm:text-sm"
          disabled={isFetchButtonDisabled}
        />
        <button
          onClick={handleFetchCountries}
          disabled={isFetchButtonDisabled}
          className="text-white font-semibold bg-blue-600 hover:bg-blue-700 my-4 py-2.5 px-6 rounded-lg flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Fetching...
            </>
          ) : (
            "Fetch Countries"
          )}
        </button>
      </div>
      {fetchedCountries.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl font-medium mb-3 text-gray-600">
            Fetched Results ({fetchedCountries.length}):
          </h3>
          <ul className="flex flex-col gap-3">
            {fetchedCountries.map((country) => (
              <CountryListItem
                key={country.code}
                country={country}
                actionButton={
                  <button
                    onClick={() => handleSaveCountry(country)}
                    disabled={isCountrySaved(country.code)}
                    className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-center text-sm font-medium py-1.5 px-4 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    {isCountrySaved(country.code)
                      ? "✓ Saved"
                      : "+ Save to List"}
                  </button>
                }
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default FetchSection;
