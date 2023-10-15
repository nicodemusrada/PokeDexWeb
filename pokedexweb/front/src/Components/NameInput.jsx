import React from "react";
import { DebounceInput } from "react-debounce-input";

export function NameInput({ onSearch }) {
  const handleNameChange = (event) => {
    const newName = event.target.value;
    onSearch(newName);
  };

  return (
    <DebounceInput
      type="text"
      placeholder="Enter Pokemon Name"
      minLength={1}
      debounceTimeout={700}
      onChange={handleNameChange}
      className="input-small"
    />
  );
}
