"use client";

import { Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TableSearch = ({
  searchTerm,
  setSearchTerm,
}: TableSearchProps) => {
  return (
    <div className="w-full max-w-[340px]  self-center">
      <Label htmlFor="search" className="sr-only">
        Search bands
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          id="search"
          type="search"
          placeholder="Search bands, countries, genres, evidence..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11"
        />
      </div>
    </div>
  );
};

interface TableSearchProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}
