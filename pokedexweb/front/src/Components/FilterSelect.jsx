import React, { useState } from "react";
import { POKEMON_TYPES } from "../types";

export function FilterSelect({ onFilter }) {
  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    onFilter(newType);
  };

  return (
    <select
      value={selectedType}
      onChange={handleTypeChange}
      className="select-small"
    >
      <option value="">Filter by Type</option>
      {POKEMON_TYPES.map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}
