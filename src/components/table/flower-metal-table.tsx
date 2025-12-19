"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GoogleSheetItem } from "@/types/google-sheet";
import { getCategoryLabel } from "@/utils/get-category-label";

export const FlowerMetalTable = ({ items }: FlowerMetalTableProps) => {
  return (
    <Card className="overflow-hidden rounded-lg shadow-lg border-border/50">
      <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm z-10 border-b-2 border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[220px] font-semibold text-foreground/90">
                Artist / Label
              </TableHead>
              <TableHead className="w-[120px] font-semibold text-foreground/90">
                Country
              </TableHead>
              <TableHead className="w-[140px] font-semibold text-foreground/90">
                Category
              </TableHead>
              <TableHead className="hidden md:table-cell font-semibold text-foreground/90">
                Explanation
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <TableRow
                key={`${item.category}-${index}`}
                className={`transition-colors hover:bg-muted/50 border-b border-border/30 last:border-0 ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/10"
                }`}
              >
                <TableCell className="font-medium whitespace-normal break-words max-w-[220px] py-4">
                  {item.artist ?? "—"}
                </TableCell>

                <TableCell className="py-4 text-2xl">
                  {isFlagEmoji(item.country) ? item.country : "—"}
                </TableCell>

                <TableCell className="py-4">
                  <span className="inline-flex items-center rounded-md bg-accent/80 px-2.5 py-1 text-xs font-medium text-accent-foreground">
                    {getCategoryLabel(item.category)}
                  </span>
                </TableCell>

                <TableCell className="hidden md:table-cell whitespace-normal break-words py-4 leading-relaxed text-foreground/90">
                  {item.explanation ? (
                    item.explanation
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
