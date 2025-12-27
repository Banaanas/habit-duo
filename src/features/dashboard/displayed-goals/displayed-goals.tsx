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
    <div className="flex flex-col gap-y-2">
      <DisplayedGoalsHeader
        isViewingCurrentUser={isViewingCurrentUser}
        userName={selectedUser.name}
        avatarEmoji={selectedUser.avatarEmoji}
      />

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

const DisplayedGoalsHeader = ({
  isViewingCurrentUser,
  userName,
  avatarEmoji,
}: DisplayedGoalsHeaderProps) => {
  const title = isViewingCurrentUser ? "Your Goals" : `${userName}'s Goals`;

  return (
    <div className="flex items-center gap-x-2">
      <span className="text-xl">{avatarEmoji}</span>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
};

interface DisplayedGoalsHeaderProps {
  isViewingCurrentUser: boolean;
  userName: string;
  avatarEmoji: string;
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
    <div className="flex flex-col gap-y-2">
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

const EmptyGoalsState = ({
  isViewingCurrentUser,
  userName,
}: EmptyGoalsStateProps) => {
  const message = isViewingCurrentUser
    ? "No goals yet. Add your first goal to get started!"
    : `${userName} hasn't added any goals yet.`;

  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <p className="text-muted-foreground max-w-[280px] text-pretty">
        {message}
      </p>
    </div>
  );
};

interface EmptyGoalsStateProps {
  isViewingCurrentUser: boolean;
  userName: string;
}
