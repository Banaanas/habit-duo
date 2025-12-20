import { ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { GoogleSheetItem } from "@/types/google-sheet";
import { getCategoryLabel } from "@/utils/get-category-label";

/**
 * Note: We use TableBody as the direct child of Collapsible (with asChild) because:
 * 1. Collapsible only accepts a single child.
 * 2. HTML <table> elements do not allow <div> as a direct child.
 * 3. TableBody can contain multiple TableRows (Trigger and Content), keeping it HTML compliant.
 */
export const TableRowTrigger = ({
  artist,
  country,
  category,
  explanation,
  index,
}: TableRowTriggerProps) => {
  return (
    <Collapsible key={`${category}-${index}`} asChild>
      <TableBody
        className={cn(
          "border-b border-border/30 last:border-0",
          index % 2 === 0 ? "bg-background" : "bg-muted/20"
        )}
      >
        <RowCollapsibleTrigger
          artist={artist}
          country={country}
          category={category}
          explanation={explanation}
        />
        <RowCollapsibleContent explanation={explanation} />
      </TableBody>
    </Collapsible>
  );
};

const RowCollapsibleTrigger = ({
  artist,
  country,
  category,
  explanation,
}: Pick<
  TableRowTriggerProps,
  "artist" | "country" | "category" | "explanation"
>) => {
  const hasExplanation = explanation && explanation.trim() !== "";

  if (!hasExplanation) return null;

  return (
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
        <TableCell className="py-4 hidden sm:table-cell ">
          <span className="inline-flex items-center rounded-md bg-accent/80 px-2.5 py-1 text-xs font-medium text-accent-foreground">
            {getCategoryLabel(category)}
          </span>
        </TableCell>
        <TableCell className="hidden sm:table-cell whitespace-normal break-words py-4 leading-relaxed text-foreground/90">
          {hasExplanation ? (
            explanation
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell className="sm:hidden flex py-4 text-right">
          {hasExplanation && (
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/50 transition-transform duration-200 [[data-state=open]_&]:rotate-180">
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Toggle explanation</span>
            </div>
          )}
        </TableCell>
      </TableRow>
    </CollapsibleTrigger>
  );
};

const RowCollapsibleContent = ({
  explanation,
}: Pick<TableRowTriggerProps, "explanation">) => {
  const hasExplanation = explanation && explanation.trim() !== "";

  if (!hasExplanation) return null;

  return (
    <CollapsibleContent asChild>
      <TableRow className="sm:hidden border-none bg-transparent">
        <TableCell
          colSpan={4}
          className="py-4 px-4 pt-0 whitespace-normal break-words"
        >
          <div className="text-sm leading-relaxed text-foreground/90 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="sr-only">Explanation</span>
            {explanation}
          </div>
        </TableCell>
      </TableRow>
    </CollapsibleContent>
  );
};

interface TableRowTriggerProps extends GoogleSheetItem {
  index: number;
}

const isFlagEmoji = (value: string | null | undefined): boolean => {
  if (!value) return false;

  return /^[\u{1F1E6}-\u{1F1FF}]{2}$/u.test(value);
};
