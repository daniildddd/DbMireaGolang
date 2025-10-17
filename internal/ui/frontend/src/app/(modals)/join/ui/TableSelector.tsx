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
    <Select<string>
      multiple
      value={selected}
      onUpdate={(value) => onChange(value)}
      options={TABLES}
      placeholder="Выберите таблицы..."
      hasCounter
      hasClear
      className="multiple-table-selector"
    />
  );
}
