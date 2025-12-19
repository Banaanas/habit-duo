"use client";

import type { Dispatch, SetStateAction } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  CATEGORY_FILTERS,
  type SheetCategory,
} from "@/data/google-sheets.config";

export const TableCategoryToggle = ({
  value,
  onValueChange,
}: TableCategoryFilterProps) => {
  const handleValueChange = (val: string) => {
    onValueChange(val as SheetCategory);
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={handleValueChange}
      className="border-2 border-foreground/80 rounded-lg bg-card shadow-sm p-1"
    >
      {CATEGORY_FILTERS.map(({ category, label }) => (
        <ToggleGroupItem
          key={category}
          value={category}
          className="data-[state=on]:bg-accent/90 data-[state=on]:text-accent-foreground data-[state=on]:shadow-sm transition-all"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

interface TableCategoryFilterProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<SheetCategory>>;
}
