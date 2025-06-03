import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchRandomCountries } from "../api/countryService";
import type { CountryItem, ViewMode } from "../types";
import { COUNTRIES } from "../constants/countries";
import ErrorMessage from "../components/ErrorMessage";
import PageHeader from "../components/CountriesPage/PageHeader";
import SavedSection from "../components/CountriesPage/SavedSection";
import FetchSection from "../components/CountriesPage/FetchSection";
import ViewModeControls from "../components/CountriesPage/ViewModeControls";

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
  const [isFetchActionOnCooldown, setIsFetchActionOnCooldown] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLimit, setFetchLimit] = useState<number>(COUNTRIES.FETCH_LIMIT);
  const [viewMode, setViewMode] = useState<ViewMode>("all");

  useEffect(() => {
    localStorage.setItem("savedCountries", JSON.stringify(savedCountries));
  }, [savedCountries]);

  const handleFetchCountries = useCallback(async () => {
    if (!token) {
      setError("Authentication error. Please log in again.");
      logout();
      return;
    }
    if (isFetchActionOnCooldown) {
      setError("Please wait before fetching more countries.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFetchedCountries([]);
    setIsFetchActionOnCooldown(true);
    setTimeout(() => {
      setIsFetchActionOnCooldown(false);
    }, COUNTRIES.FETCH_ACTION_COOLDOWN_MS);

    try {
      const countriesData = await fetchRandomCountries(fetchLimit, token);
      const sortedCountries = countriesData.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setFetchedCountries(sortedCountries);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.toLowerCase().includes("unauthorized")) logout();
      } else setError("An unknown error occurred while fetching countries.");
    } finally {
      setIsLoading(false);
    }
  }, [token, fetchLimit, logout, isFetchActionOnCooldown]);

  const handleSaveCountry = (countryToSave: CountryItem) => {
    if (!savedCountries.find((country) => country.code === countryToSave.code))
      setSavedCountries((prevSaved) =>
        [...prevSaved, countryToSave].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
    else alert(`${countryToSave.name} is already in your saved list.`);
  };

  const handleRemoveCountry = (countryCodeToRemove: string) => {
    setSavedCountries((prevSaved) =>
      prevSaved.filter((country) => country.code !== countryCodeToRemove)
    );
  };

  const isCountrySaved = (countryCode: string): boolean => {
    return savedCountries.some((c) => c.code === countryCode);
  };

  const showFetchSection = viewMode === "all" || viewMode === "fetch";
  const showSavedSection = viewMode === "all" || viewMode === "saved";

  return (
    <div className="min-h-screen">
      <PageHeader handleLogout={logout} />
      <main className="flex flex-col gap-4 container mx-auto p-4 sm:p-6 lg:p-8">
        {error && <ErrorMessage error={error} />}
        <ViewModeControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          savedCountriesCount={savedCountries.length}
        />
        {showFetchSection && (
          <FetchSection
            fetchLimit={fetchLimit}
            setFetchLimit={setFetchLimit}
            handleFetchCountries={handleFetchCountries}
            isLoading={isLoading}
            isFetchButtonDisabled={isFetchActionOnCooldown}
            fetchedCountries={fetchedCountries}
            handleSaveCountry={handleSaveCountry}
            isCountrySaved={isCountrySaved}
          />
        )}
        {showFetchSection && showSavedSection && (
          <hr className="border-gray-300" />
        )}
        {showSavedSection && (
          <SavedSection
            savedCountries={savedCountries}
            handleRemoveCountry={handleRemoveCountry}
            showFetchSectionHint={showFetchSection}
          />
        )}
      </main>
    </div>
  );
};

export default CountriesPage;
