
import { useState } from "react";
import { Globe, Map, MapPin } from "lucide-react";

type Region = "global" | "continent" | "country" | "region" | "city" | "nearby";

type LeaderboardFiltersProps = {
  onFilterChange: (region: Region) => void;
};

const LeaderboardFilters = ({ onFilterChange }: LeaderboardFiltersProps) => {
  const [activeFilter, setActiveFilter] = useState<Region>("global");

  const handleFilterChange = (region: Region) => {
    setActiveFilter(region);
    onFilterChange(region);
  };

  const filters: { id: Region; label: string; icon: JSX.Element }[] = [
    { id: "global", label: "Global", icon: <Globe size={18} /> },
    { id: "continent", label: "Continent", icon: <Globe size={18} /> },
    { id: "country", label: "Country", icon: <Globe size={18} /> },
    { id: "region", label: "Region", icon: <Map size={18} /> },
    { id: "city", label: "City", icon: <Map size={18} /> },
    { id: "nearby", label: "Nearby (3mi)", icon: <MapPin size={18} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2 my-4">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterChange(filter.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 ${
            activeFilter === filter.id
              ? "bg-primary text-white"
              : "bg-white/10 text-text-muted hover:bg-white/20"
          }`}
        >
          {filter.icon}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LeaderboardFilters;
