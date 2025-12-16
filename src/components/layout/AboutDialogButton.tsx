"use client"

import { Info } from "lucide-react";
import { useState } from "react";

import { AboutDialog } from "@/components/shared/about-dialog";
import { Button } from "@/components/ui/button";

export const AboutDialogButton = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={() => setAboutDialogOpen(true)}
    >
      <Info className="h-4 w-4" />
      <span className="hidden sm:inline">About</span>

      <AboutDialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen} />
    </Button>
  );
};
