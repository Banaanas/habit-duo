import { GoalCard } from "@/features/dashboard/goal-card";
import type { Completion, Goal, User } from "@/types/database-camel-case";

export const DisplayedGoals = ({
  displayedGoals,
  completions,
  selectedUser,
  isViewingCurrentUser,
  weekStartDate,
  weekEndDate,
  onToggle,
  onDelete,
}: DisplayedGoalsProps) => {
  return (
    <>
      {/* User Goals Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{selectedUser.avatarEmoji}</span>
        <h2 className="text-xl font-bold">
          {isViewingCurrentUser ? "Your Goals" : `${selectedUser.name}'s Goals`}
        </h2>
      </div>

      {/* Goals */}
      <div className="space-y-4">
        {displayedGoals.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <p className="text-muted-foreground">
              {isViewingCurrentUser
                ? "No goals yet. Add your first goal to get started!"
                : `${selectedUser.name} hasn't added any goals yet.`}
            </p>
          </div>
        ) : (
          displayedGoals.map((goal) => {
            const goalCompletions = completions.filter(
              (c) => c.goalId === goal.id
            );
            return (
              <GoalCard
                key={goal.id}
                goal={goal}
                completions={goalCompletions}
                weekStartDate={weekStartDate}
                weekEndDate={weekEndDate}
                onToggle={onToggle}
                onDelete={onDelete}
                isCurrentUser={isViewingCurrentUser}
              />
            );
          })
        )}
      </div>
    </>
  );
};

interface DisplayedGoalsProps {
  displayedGoals: Goal[];
  completions: Completion[];
  selectedUser: User;
  isViewingCurrentUser: boolean;
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
}
