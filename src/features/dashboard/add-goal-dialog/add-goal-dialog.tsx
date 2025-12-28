"use client";

import { useState } from "react";

import { createGoalAction } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appLimits } from "@/data/app-data";

export const AddGoalDialog = ({
  open,
  onOpenChange,
  userId,
  weekId,
}: AddGoalDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxGoalsNumber = appLimits.maxDaysPerGoal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createGoalAction(
        userId,
        weekId,
        title.trim(),
        description.trim() || undefined
      );

      // Reset form
      setTitle("");
      setDescription("");

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create goal:", error);
      alert("Failed to create goal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription className="text-pretty text-left">
              Create a new daily habit goal for this week. You can track up to{" "}
              {maxGoalsNumber} goals per week. All goals are daily commitments.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Goal Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Exercise daily"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="placeholder:text-xs"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="e.g., 30 minutes of cardio or strength training"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="placeholder:text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? "Creating..." : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  weekId: string;
}
