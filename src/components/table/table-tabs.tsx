"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SHEETS, SheetCategory } from "@/data/google-sheets.config";

export const TableTabs = ({
  value,
  onValueChange,
  children,
}: TableTabsProps) => {
  const handleValueChange = (val: string) => {
    onValueChange(val as SheetCategory);
  };

  return (
    <Tabs value={value} onValueChange={handleValueChange} className="mb-8">
      <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
        {tabSheets.map(({ category, label }) => (
          <TabsTrigger key={category} value={category}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {children}
    </Tabs>
  );
};

interface TableTabsProps {
  value: string;
  onValueChange: Dispatch<SetStateAction<SheetCategory>>;
  children: ReactNode;
}

const tabSheets = [
  SHEETS.blackMetal,
  SHEETS.otherGenres,
  SHEETS.recordLabels,
  SHEETS.all,
];
