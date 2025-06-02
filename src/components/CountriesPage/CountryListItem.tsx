import React from "react";
import type { CountryItem } from "../../types";

interface CountryListItemProps {
  country: CountryItem;
  actionButton: React.ReactNode;
}

const CountryListItem: React.FC<CountryListItemProps> = ({
  country,
  actionButton,
}) => {
  return (
    <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg">
      <div className="mb-2 sm:mb-0">
        <span className="text-md sm:text-lg font-medium text-gray-800">
          {country.name}
        </span>
        <span className="text-sm text-gray-500 ml-2">({country.code})</span>
      </div>
      {actionButton}
    </li>
  );
};

export default CountryListItem;
