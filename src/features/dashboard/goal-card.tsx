"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { GoalActionResult } from "@/actions/goals";
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
import { DayButton } from "@/features/dashboard/day-button";
import type { Completion, Goal } from "@/types/database-camel-case";
import {
  formatDateToISO,
  getCurrentWeekDates,
  isPastOrToday,
} from "@/utils/date";

export const GoalCard = ({
  goal,
  completions,
  weekStartDate,
  weekEndDate,
  onToggle,
  onDelete,
  onEdit,
  isCurrentUser,
}: GoalCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const weekDates = getCurrentWeekDates(weekStartDate, weekEndDate);
  const isArchived = goal.archivedAt !== null;

  const isCompleted = (date: Date): boolean => {
    const dateStr = formatDateToISO(date);
    return completions.some((c) => c.completionDate === dateStr);
  };

  // Only count completions within the week's date range to match the visual display
  const validCompletions = completions.filter(
    (c) => c.completionDate >= weekStartDate && c.completionDate <= weekEndDate
  );
  const completedCount = validCompletions.length;
  const totalDays = weekDates.filter(isPastOrToday).length;

  const handleArchive = () => {
    startTransition(async () => {
      const result = await onDelete(goal.id);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setArchiveOpen(false);
      router.refresh();
    });
  };

  const handleToggle = (goalId: string, dateStr: string) =>
    onToggle(goalId, dateStr);

  const handleEditSave = async (title: string, description: string | null) => {
    const result = await onEdit(goal.id, title, description);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setEditOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-card border-border flex flex-col gap-y-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <GoalHeader goal={goal} isArchived={isArchived} />
          {!isArchived ? (
            <GoalActions
              onArchive={() => setArchiveOpen(true)}
              onEdit={() => setEditOpen(true)}
              isCurrentUser={isCurrentUser}
              isPending={isPending}
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-y-4">
          <DayButtons
            weekDates={weekDates}
            isCompleted={isCompleted}
            canToggleGoal={isCurrentUser && !isArchived}
            goalId={goal.id}
            onToggle={handleToggle}
          />

          <hr />
          <p className="text-muted-foreground text-left text-sm">
            <span className="font-bold">{completedCount}</span>/{totalDays} days
            completed
          </p>
        </div>
      </div>

      {isCurrentUser && !isArchived ? (
        <>
          <EditGoalDialog
            goal={goal}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSave={handleEditSave}
          />
          <ArchiveGoalDialog
            goalTitle={goal.title}
            open={archiveOpen}
            onOpenChange={setArchiveOpen}
            onConfirm={handleArchive}
            isPending={isPending}
          />
        </>
      ) : null}
    </>
  );
};

interface GoalCardProps {
  goal: Goal;
  completions: Completion[];
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<GoalActionResult>;
  onDelete: (goalId: string) => Promise<GoalActionResult>;
  onEdit: (
    goalId: string,
    title: string,
    description: string | null
  ) => Promise<GoalActionResult>;
  isCurrentUser: boolean;
}

const GoalActions = ({
  onArchive,
  onEdit,
  isPending,
  isCurrentUser,
}: GoalActionsProps) => {
  if (!isCurrentUser) return null;

  return (
    <div className="flex items-center gap-x-1">
      <button
        onClick={onEdit}
        aria-label="Edit goal"
        className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={onArchive}
        disabled={isPending}
        aria-label="Archive goal"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors disabled:opacity-50"
      >
        <Trash2Icon className="h-4 w-4" />
      </button>
    </div>
  );
};

interface GoalActionsProps {
  onArchive: () => void;
  onEdit: () => void;
  isPending: boolean;
  isCurrentUser: boolean;
}

const GoalHeader = ({
  goal,
  isArchived,
}: {
  goal: Goal;
  isArchived: boolean;
}) => {
  const { title, description } = goal;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-x-2">
        <h3 className="text-foreground font-semibold">{title}</h3>
        {isArchived ? (
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
            Archived
          </span>
        ) : null}
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

interface DayButtonsProps {
  weekDates: Date[];
  isCompleted: (date: Date) => boolean;
  canToggleGoal: boolean;
  goalId: string;
  onToggle: (goalId: string, date: string) => Promise<GoalActionResult>;
}

const DayButtons = ({
  weekDates,
  isCompleted,
  canToggleGoal,
  goalId,
  onToggle,
}: DayButtonsProps) => {
  return (
    <div className="flex gap-1">
      {weekDates.map((date) => (
        <DayButton
          key={date.toISOString()}
          date={date}
          isCompleted={isCompleted(date)}
          canToggle={isPastOrToday(date) && canToggleGoal}
          onToggle={(dateStr) => onToggle(goalId, dateStr)}
        />
      ))}
    </div>
  );
};

const ArchiveGoalDialog = ({
  goalTitle,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ArchiveGoalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Archive &ldquo;{goalTitle}&rdquo;?</DialogTitle>
          <DialogDescription className="text-left text-pretty">
            The goal will be removed from your current goals, but its history
            (heatmap, past weeks) is kept. You can restore it anytime from the
            archived goals list.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Archiving..." : "Archive"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ArchiveGoalDialogProps {
  goalTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

const EditGoalDialog = ({
  goal,
  open,
  onOpenChange,
  onSave,
}: EditGoalDialogProps) => {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onSave(title.trim(), description.trim() || null);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">
                Goal Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Input
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, description: string | null) => Promise<void>;
}
