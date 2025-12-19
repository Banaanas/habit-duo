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
      onValueChange={handleValueChange}
      className="border-1"
    >
      {CATEGORY_FILTERS.map(({ category, label }) => (
        <ToggleGroupItem key={category} value={category}>
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
