"use client";

import { useState } from "react";

import { FlowerMetalTable } from "@/components/table/flower-metal-table";
import { TableSearch } from "@/components/table/table-search";
import { TableTabs } from "@/components/table/table-tabs";
import { SHEETS, SheetCategory } from "@/data/google-sheets.config";
import { GoogleSheetItem } from "@/types/google-sheet";

export const FlowerMetalView = ({ items }: FlowerMetalView) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<SheetCategory>(
    SHEETS.blackMetal.category
  );

  const filteredItems = filterItems(items, selectedTab, searchTerm);

  return (
    <div className="flex flex-col gap-y-8">
      <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <TableTabs value={selectedTab} onValueChange={setSelectedTab}>
        <FlowerMetalTable items={filteredItems} />
      </TableTabs>
    </div>
  );
};

interface FlowerMetalView {
  items: GoogleSheetItem[];
}

const filterItems = (
  items: GoogleSheetItem[],
  selectedTab: SheetCategory,
  searchTerm: string
): GoogleSheetItem[] => {
  return items.filter((item) => {
    // Filter by category (unless "all" is selected)
    if (selectedTab !== "all" && item.category !== selectedTab) {
      return false;
    }

    // If no search term, show all items in this category
    if (!searchTerm.trim()) return true;

    // Search across multiple fields
    const searchLower = searchTerm.toLowerCase();
    return (
      item.artist?.toLowerCase().includes(searchLower) ||
      item.country?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower) ||
      item.explanation?.toLowerCase().includes(searchLower)
    );
  });
};
