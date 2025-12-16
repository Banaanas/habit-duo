import { ExternalLink } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">About This Database</DialogTitle>
          <DialogDescription>
            Understanding the Metal Accountability Database
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div>
            <h4 className="font-semibold text-base text-foreground mb-2">
              Purpose
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Metal Accountability Database (Flower Metal) tracks metal
              bands with documented or alleged connections to Nazi ideology
              (NSBM), white supremacy, and related extremist movements. This
              resource helps fans, venues, and labels make informed decisions
              about which artists to support.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground mb-2">
              Methodology
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bands are categorized based on publicly available evidence
              including lyrics, interviews, member statements, imagery, and
              associations with known extremist groups. We use three evidence
              classifications:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Confirmed:</strong> Multiple
                sources documenting explicit extremist ideology
              </li>
              <li>
                <strong className="text-foreground">Alleged:</strong> Credible
                allegations with some supporting evidence
              </li>
              <li>
                <strong className="text-foreground">Associated:</strong>{" "}
                Significant connections to extremist networks or figures
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground mb-2">
              How to Contribute
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have documented evidence of bands that should be included
              or updates to existing entries, please contribute via the{" "}
              <a
                href="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Google Sheet
                <ExternalLink className="h-3 w-3" />
              </a>
              . All submissions should include verifiable sources.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground mb-2">
              Disclaimer
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is a community-maintained resource for informational
              purposes. Evidence quality varies and allegations should be
              evaluated critically. This database is not a call for censorship
              but a tool for accountability and informed choice. Some bands have
              disavowed past associations - context matters.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
