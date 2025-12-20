"use client";

import { TableRowTrigger } from "@/components/table/table-row-trigger";
import { Card } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { GoogleSheetItem } from "@/types/google-sheet";

export const FlowerMetalTable = ({ items }: FlowerMetalTableProps) => {
  return (
    <Card className="overflow-hidden w-full rounded-lg shadow-lg border-border/50 p-0">
      <div className="overflow-x-auto max-h-[min(400px,90vh)] overflow-y-auto">
        <Table>
          <TableHeader className="backdrop-blur-sm bg-muted/50 z-10 border-b-2 border-border/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[220px] py-4 font-semibold text-foreground/90">
                Artist / Label
              </TableHead>
              <TableHead className="py-4 font-semibold text-foreground/90">
                Country
              </TableHead>
              <TableHead className="hidden sm:table-cell py-4 font-semibold text-foreground/90">
                Category
              </TableHead>
              <TableHead className="hidden sm:table-cell py-4 font-semibold text-foreground/90">
                Explanation
              </TableHead>
              <TableHead className="w-[140px] sm:hidden py-4 font-semibold text-foreground/90">
                <span className="sr-only">Expand</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {items.map((item, index) => {
            return (
              <TableRowTrigger
                key={index}
                index={index}
                {...item}
              ></TableRowTrigger>
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
