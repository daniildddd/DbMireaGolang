// app/(modals)/join/ui/TableSelector.tsx
"use client";

import { Select, Button } from "@gravity-ui/uikit";

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
  return (
    <Select
      className="multiple-table-selector"
      placeholder="Выберите таблицы..."
      multiple
      value={selected}
      onUpdate={(value) => onChange(value as string[])}
      options={TABLES}
      renderOption={(option) => (
        <Button
          className="multiple-table-selector__option"
          key={option.value}
          view="flat"
          size="s"
        >
          {option.text}
        </Button>
      )}
      renderControl={(option) => (
        <Button view="flat" size="m">
          NaN
        </Button>
      )}
    />
  );
}
