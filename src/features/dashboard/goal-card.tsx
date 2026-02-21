"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  const weekDates = getCurrentWeekDates(weekStartDate, weekEndDate);

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

  const handleDelete = async () => {
    startTransition(async () => {
      await onDelete(goal.id);
      router.refresh();
    });
  };

  const handleToggle = async (dateStr: string) => {
    await onToggle(goal.id, dateStr);
  };

  const handleEditSave = async (title: string, description?: string) => {
    await onEdit(goal.id, title, description);
    setEditOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="bg-card border-border flex flex-col gap-y-4 rounded-xl border p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <GoalHeader goal={goal} />
          <GoalActions
            onDelete={handleDelete}
            onEdit={() => setEditOpen(true)}
            isCurrentUser={isCurrentUser}
            isPending={isPending}
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <DayButtons
            weekDates={weekDates}
            isCompleted={isCompleted}
            isCurrentUser={isCurrentUser}
            onToggle={handleToggle}
          />

          <hr />
          <p className="text-muted-foreground text-left text-sm">
            <span className="font-bold">{completedCount}</span>/{totalDays} days
            completed
          </p>
        </div>
      </div>

      {isCurrentUser ? (
        <EditGoalDialog
          goal={goal}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleEditSave}
        />
      ) : null}
    </>
  );
};

interface GoalCardProps {
  goal: Goal;
  completions: Completion[];
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  onEdit: (
    goalId: string,
    title: string,
    description?: string
  ) => Promise<void>;
  isCurrentUser: boolean;
}

const GoalActions = ({
  onDelete,
  onEdit,
  isPending,
  isCurrentUser,
}: GoalActionsProps) => {
  if (!isCurrentUser) return null;

  return (
    <div className="flex items-center gap-x-1">
      <button
        onClick={onEdit}
        className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        disabled={isPending}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2 transition-colors disabled:opacity-50"
      >
        <Trash2Icon className="h-4 w-4" />
      </button>
    </div>
  );
};

interface GoalActionsProps {
  onDelete: MouseEventHandler<HTMLButtonElement>;
  onEdit: () => void;
  isPending: boolean;
  isCurrentUser: boolean;
}

const GoalHeader = ({ goal }: { goal: Goal }) => {
  const { title, description } = goal;

  return (
    <div className="flex-1">
      <h3 className="text-foreground font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

interface DayButtonsProps {
  weekDates: Date[];
  isCompleted: (date: Date) => boolean;
  isCurrentUser: boolean;
  onToggle: (date: string) => Promise<void>;
}

const DayButtons = ({
  weekDates,
  isCompleted,
  isCurrentUser,
  onToggle,
}: DayButtonsProps) => {
  return (
    <div className="flex gap-1">
      {weekDates.map((date) => (
        <DayButton
          key={date.toISOString()}
          date={date}
          isCompleted={isCompleted(date)}
          canToggle={isPastOrToday(date) && isCurrentUser}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

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

    try {
      setIsSubmitting(true);
      await onSave(title.trim(), description.trim() || undefined);
    } catch (error) {
      console.error("Failed to update goal:", error);
    } finally {
      setIsSubmitting(false);
    }
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
  onSave: (title: string, description?: string) => Promise<void>;
}
