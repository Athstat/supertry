import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { countryFlags, Country } from "../../types/countries";
import { twMerge } from "tailwind-merge";

interface CountrySelectProps {
  value?: Country;
  onChange: (country: Country) => void;
  className?: string
}

export function CountrySelect({ value, onChange, className }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);


  const filteredCountries = countryFlags.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={twMerge(
      "relative w-full", className
    )} ref={dropdownRef}>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100 flex items-center justify-between"
      >
        {value ? (
          <span className="flex w-full items-center gap-2">
            <span className="text-2xl">{value.flag}</span>
            {value.name}
          </span>
        ) : (
          <span className="text-gray-500 w-full dark:text-gray-400">
            Select your country
          </span>
        )}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="w-full mt-2 bg-white dark:bg-dark-850 rounded-xl shadow-lg border border-gray-200 dark:border-dark-600">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-dark-700/40 border border-gray-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="dark:text-gray-100">{country.name}</span>
                </span>
                {value?.code === country.code && (
                  <Check className="h-5 w-5 text-primary-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
