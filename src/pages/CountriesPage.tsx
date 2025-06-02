import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchRandomCountries } from "../api/countryService";
import type { CountryItem } from "../types";
import Spinner from "../components/icons/Spinner";
import { COUNTRIES } from "../constants/countries";
import ErrorMessage from "../components/ErrorMessage";

const CountriesPage: React.FC = () => {
  const { token, logout } = useAuth();
  const [fetchedCountries, setFetchedCountries] = useState<CountryItem[]>([]);
  const [savedCountries, setSavedCountries] = useState<CountryItem[]>(() => {
    try {
      const storedSavedCountries = localStorage.getItem("savedCountries");
      return storedSavedCountries ? JSON.parse(storedSavedCountries) : [];
    } catch (e) {
      console.error("Error parsing saved countries from localStorage:", e);
      localStorage.removeItem("savedCountries");
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLimit, setFetchLimit] = useState<number>(COUNTRIES.FETCH_LIMIT);

  useEffect(() => {
    localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  }, [savedCountries]);

  const handleFetchCountries = useCallback(async () => {
    if (!token) {
      setError("Authentication error. Please log in again.");
      logout();
      return;
    }
    setIsLoading(true);
    setError(null);
    setFetchedCountries([]);
    try {
      const countriesData = await fetchRandomCountries(fetchLimit, token);
      setFetchedCountries(countriesData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.toLowerCase().includes("unauthorized")) logout();
      } else setError("An unknown error occurred while fetching countries.");
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchLimit, logout]);

  const handleSaveCountry = (countryToSave: CountryItem) => {
    if (!savedCountries.find((country) => country.code === countryToSave.code))
      setSavedCountries((prevSaved) => [...prevSaved, countryToSave]);
    else alert(`${countryToSave.name} is already in your saved list.`);
  };

  const handleRemoveCountry = (countryCodeToRemove: string) => {
    setSavedCountries((prevSaved) =>
      prevSaved.filter((country) => country.code !== countryCodeToRemove)
    );
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen">
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

      <main className="flex flex-col gap-4 container mx-auto p-4 sm:p-6 lg:p-8">
        {error && <ErrorMessage error={error} />}
        <section className="flex flex-col gap-6 py-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            Discover New Countries
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
            />
            <button
              onClick={handleFetchCountries}
              disabled={isLoading}
              className="text-white font-semibold bg-blue-600 hover:bg-blue-700 my-4 py-2.5 px-6 rounded-lg flex items-center justify-center"
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
                Fetched Results:
              </h3>
              <ul className="flex flex-col gap-3">
                {fetchedCountries.map((country) => (
                  <li
                    key={country.code}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg"
                  >
                    <div className="mb-2 sm:mb-0">
                      <span className="text-md sm:text-lg font-medium text-gray-800">
                        {country.name}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({country.code})
                      </span>
                    </div>
                    <button
                      onClick={() => handleSaveCountry(country)}
                      disabled={savedCountries.some(
                        (c) => c.code === country.code
                      )}
                      className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-1.5 px-4 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      {savedCountries.some((c) => c.code === country.code)
                        ? "✓ Saved"
                        : "+ Save to List"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <hr className="border-gray-300" />

        <section className="flex flex-col gap-6 py-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
            My Saved Countries List
          </h2>
          {savedCountries.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {savedCountries.map((country) => (
                <li
                  key={`saved-${country.code}`}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg"
                >
                  <div className="mb-2 sm:mb-0">
                    <span className="text-md sm:text-lg font-medium text-gray-800">
                      {country.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({country.code})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveCountry(country.code)}
                    className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 px-4 rounded-md"
                  >
                    &times; Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              Your list is empty. Fetch and save some countries to get started!
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CountriesPage;
