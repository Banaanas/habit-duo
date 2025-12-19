"use client";

import { Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TableSearch = ({
  searchTerm,
  setSearchTerm,
}: TableSearchProps) => {
  return (
    <div className="w-full max-w-[260px]">
      <Label htmlFor="search" className="sr-only">
        Search bands
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          type="search"
          placeholder="Search bands, labels, countries…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10"
        />
      </div>
    </div>
  );
};

interface TableSearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}
