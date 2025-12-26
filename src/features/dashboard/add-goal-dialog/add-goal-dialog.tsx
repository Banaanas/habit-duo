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

export const AddGoalDialog = ({
  open,
  onOpenChange,
  userId,
  weekId,
}: AddGoalDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDays, setTargetDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createGoalAction(
        userId,
        weekId,
        title.trim(),
        description.trim() || undefined,
        targetDays
      );

      // Reset form
      setTitle("");
      setDescription("");
      setTargetDays(7);

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
            <DialogDescription>
              Create a new habit goal for this week. You can track up to 2 goals
              per week.
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="e.g., 30 minutes of cardio or strength training"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="targetDays">Target Days</Label>
              <Input
                id="targetDays"
                type="number"
                min={1}
                max={7}
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">
                How many days this week do you want to complete this goal? (1-7)
              </p>
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
