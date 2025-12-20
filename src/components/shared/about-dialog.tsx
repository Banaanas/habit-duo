import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { appSlogan } from "@/data/app-data";
import {
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_ROOT,
  SHEETS,
} from "@/data/google-sheets.config";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutDialog = ({ open, onOpenChange }: AboutDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-col gap-y-0 items-center">
          <DialogTitle className="text-2xl">About Flower Metal</DialogTitle>
          <DialogDescription className="italic">{appSlogan}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          <div>
            <h4 className="font-semibold text-base text-foreground">
              What this is
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Flower Metal is a visual exploration of a community-made dataset
              that circulates online, listing metal bands and their perceived
              proximity to far-right, Nazi, or explicitly anti-fascist
              positions.
              <a
                href={`${GOOGLE_SHEET_ROOT}/${GOOGLE_SHEET_ID}/pubhtml?pli=1#gid=${SHEETS.blackMetal.gid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 underline"
              >
                The original Sheet is available online.
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground">
              What this is not
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This site does not create, verify, investigate, or update the
              underlying data. It does not claim authority, accuracy, or
              completeness, and it is not a verdict on any band or individual.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground">
              About the data
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The original dataset is community-curated and reflects a mix of
              sources, interpretations, and historical context. Methodology is
              not publicly documented, and classifications may be disputed,
              outdated, or nuanced.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base text-foreground">
              Why this exists
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Metal has always been about expression, freedom, and resistance.
              This project exists to make existing information easier to explore
              — so people can form their own opinions and make informed personal
              choices.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
