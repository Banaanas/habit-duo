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
  const hasGoals = displayedGoals.length > 0;

  return (
    <>
      <DisplayedGoalsHeader
        isViewingCurrentUser={isViewingCurrentUser}
        userName={selectedUser.name}
        avatarEmoji={selectedUser.avatarEmoji}
      />

      <div className="space-y-4">
        {!hasGoals ? (
          <EmptyGoalsState
            isViewingCurrentUser={isViewingCurrentUser}
            userName={selectedUser.name}
          />
        ) : null}

        {hasGoals ? (
          <GoalsList
            displayedGoals={displayedGoals}
            completions={completions}
            weekStartDate={weekStartDate}
            weekEndDate={weekEndDate}
            onToggle={onToggle}
            onDelete={onDelete}
            isViewingCurrentUser={isViewingCurrentUser}
          />
        ) : null}
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

interface DisplayedGoalsHeaderProps {
  isViewingCurrentUser: boolean;
  userName: string;
  avatarEmoji: string;
}

const DisplayedGoalsHeader = ({
  isViewingCurrentUser,
  userName,
  avatarEmoji,
}: DisplayedGoalsHeaderProps) => {
  const title = isViewingCurrentUser ? "Your Goals" : `${userName}'s Goals`;

  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-3xl">{avatarEmoji}</span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};

interface GoalsListProps {
  displayedGoals: Goal[];
  completions: Completion[];
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  isViewingCurrentUser: boolean;
}

const GoalsList = ({
  displayedGoals,
  completions,
  weekStartDate,
  weekEndDate,
  onToggle,
  onDelete,
  isViewingCurrentUser,
}: GoalsListProps) => {
  return (
    <>
      {displayedGoals.map((goal) => {
        const goalCompletions = completions.filter((c) => c.goalId === goal.id);
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
      })}
    </>
  );
};

interface EmptyGoalsStateProps {
  isViewingCurrentUser: boolean;
  userName: string;
}

const EmptyGoalsState = ({
  isViewingCurrentUser,
  userName,
}: EmptyGoalsStateProps) => {
  const message = isViewingCurrentUser
    ? "No goals yet. Add your first goal to get started!"
    : `${userName} hasn't added any goals yet.`;

  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};
