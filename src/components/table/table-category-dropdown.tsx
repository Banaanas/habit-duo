"use client";

import { Check, ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORY_FILTERS, SheetCategory } from "@/data/google-sheets.config";

export const TableCategoryDropdown = ({
  value,
  onValueChange,
}: TableCategoryDropdownProps) => {
  const selectedFilter = CATEGORY_FILTERS.find((f) => f.category === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-2 border-foreground/80 shadow-sm bg-background hover:bg-accent flex w-full items-center gap-x-2 justify-around rounded-md px-3 py-2 transition-colors  text-accent-foreground font-bold min-w-[200px]">
        <span>{selectedFilter?.label}</span>
        <ChevronDown className="h-5 w-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)]"
      >
        {CATEGORY_FILTERS.map((filter) => {
          const isSelected = filter.category === value;

          return (
            <DropdownMenuItem
              key={filter.category}
              onClick={() => onValueChange(filter.category)}
              className="flex items-center justify-between"
            >
              <span>{filter.label}</span>

              {isSelected && <Check className="h-4 w-4 opacity-70" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface TableCategoryDropdownProps {
  value: SheetCategory;
  onValueChange: Dispatch<SetStateAction<SheetCategory>>;
}
