"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { GoogleSheetItem } from "@/types/google-sheet";
import { getCategoryLabel } from "@/utils/get-category-label";

export const FlowerMetalTable = ({ items }: FlowerMetalTableProps) => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-lg border-border/50 p-0">
      <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
        <Table>
          <TableHeader className="backdrop-blur-sm bg-muted/50 z-10 border-b-2 border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[220px] py-4 font-semibold text-foreground/90">
                Artist / Label
              </TableHead>
              <TableHead className="w-[120px] py-4 font-semibold text-foreground/90">
                Country
              </TableHead>
              <TableHead className="w-[140px] hidden lg:table-cell py-4 font-semibold text-foreground/90">
                Category
              </TableHead>
              <TableHead className="hidden lg:table-cell py-4 font-semibold text-foreground/90">
                Explanation
              </TableHead>
              <TableHead className="w-[50px] lg:hidden py-4 font-semibold text-foreground/90">
                <span className="sr-only">Expand</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {items.map(({ artist, country, category, explanation }, index) => {
            const hasExplanation = explanation && explanation.trim() !== "";

            return (
              <Collapsible key={`${category}-${index}`} asChild>
                <tbody
                  className={cn(
                    "border-b border-border/30 last:border-0",
                    index % 2 === 0 ? "bg-background" : "bg-muted/20"
                  )}
                >
                  <CollapsibleTrigger asChild disabled={!hasExplanation}>
                    <TableRow
                      className={cn(
                        "transition-colors border-none bg-transparent",
                        hasExplanation &&
                          "cursor-pointer sm:cursor-default sm:pointer-events-none hover:bg-muted/50"
                      )}
                    >
                      <TableCell className="font-medium whitespace-normal break-words max-w-[220px] py-4">
                        {artist ?? "—"}
                      </TableCell>
                      <TableCell className="py-4 text-2xl">
                        {isFlagEmoji(country) ? country : "—"}
                      </TableCell>
                      <TableCell className="py-4 hidden lg:table-cell ">
                        <span className="inline-flex items-center rounded-md bg-accent/80 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          {getCategoryLabel(category)}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell whitespace-normal break-words py-4 leading-relaxed text-foreground/90">
                        {hasExplanation ? (
                          explanation
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="sm:hidden py-4 text-right">
                        {hasExplanation && (
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/50 transition-transform duration-200 [[data-state=open]_&]:rotate-180">
                            <ChevronDown className="h-4 w-4" />
                            <span className="sr-only">Toggle explanation</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  {hasExplanation && (
                    <CollapsibleContent asChild>
                      <TableRow className="sm:hidden border-none bg-transparent">
                        <TableCell
                          colSpan={4}
                          className="py-4 px-4 pt-0 whitespace-normal break-words"
                        >
                          <div className="text-sm leading-relaxed text-foreground/90 animate-in fade-in slide-in-from-top-1 duration-200">
                            <p className="font-semibold mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                              Explanation
                            </p>
                            {explanation}
                          </div>
                        </TableCell>
                      </TableRow>
                    </CollapsibleContent>
                  )}
                </tbody>
              </Collapsible>
            );
          })}
        </Table>

        {items.length === 0 && (
          <div className="text-center py-16 px-4">
            <p className="text-muted-foreground text-lg">No results found.</p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

interface FlowerMetalTableProps {
  items: GoogleSheetItem[];
}

const isFlagEmoji = (value: string | null | undefined): boolean => {
  if (!value) return false;

  return /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(value);
};
