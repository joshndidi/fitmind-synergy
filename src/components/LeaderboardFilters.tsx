
import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Map, Navigation } from "lucide-react";

export type LocationFilter = "global" | "continent" | "country" | "region" | "city" | "nearby";

export interface LeaderboardFiltersProps {
  currentFilter: LocationFilter;
  onFilterChange: (filter: LocationFilter) => void;
}

const LeaderboardFilters = ({ currentFilter, onFilterChange }: LeaderboardFiltersProps) => {
  const filters: { value: LocationFilter; label: string; icon: React.ReactNode }[] = [
    { value: "global", label: "Global", icon: <Globe className="h-4 w-4" /> },
    { value: "continent", label: "Continent", icon: <Globe className="h-4 w-4" /> },
    { value: "country", label: "Country", icon: <Map className="h-4 w-4" /> },
    { value: "region", label: "Region", icon: <Map className="h-4 w-4" /> },
    { value: "city", label: "City", icon: <Map className="h-4 w-4" /> },
    { value: "nearby", label: "Nearby", icon: <Navigation className="h-4 w-4" /> },
  ];
  
  return (
    <div className="flex items-center glass-card p-0 rounded-lg">
      {filters.map((filter) => (
        <Button
          key={filter.value}
          variant={currentFilter === filter.value ? "default" : "ghost"}
          className={`rounded-none h-10 ${
            currentFilter === filter.value ? "bg-primary text-white" : "text-text-light"
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.icon}
          <span className="ml-2 hidden sm:inline">{filter.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default LeaderboardFilters;
