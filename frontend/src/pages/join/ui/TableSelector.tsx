"use client";

import { useState } from "react";

const TABLES = [
  { value: "Product", label: "Product" },
  { value: "ProductionBatch", label: "ProductionBatch" },
  { value: "Inventory", label: "Inventory" },
  { value: "Sale", label: "Sale" },
];

interface TableSelectorProps {
  selected: string[];
  onChange: (tables: string[]) => void;
}

export default function TableSelector({
  selected,
  onChange,
}: TableSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedValues: string[] = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }

    onChange(selectedValues);
  };

  return (
    <select
      multiple
      value={selected}
      onChange={handleChange}
      style={{
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "inherit",
        backgroundColor: "white",
        color: "#333",
        cursor: "pointer",
        minHeight: "100px",
      }}
    >
      {TABLES.map((table) => (
        <option key={table.value} value={table.value}>
          {table.label}
        </option>
      ))}
    </select>
  );
}
