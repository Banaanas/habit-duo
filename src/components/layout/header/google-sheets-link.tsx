import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

const GoogleSheetsLink = () => {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
        target="_blank"
        rel="noopener noreferrer"
        className="gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        <span className="hidden sm:inline">Google Sheet</span>
      </a>
    </Button>
  );
};

export default GoogleSheetsLink;
