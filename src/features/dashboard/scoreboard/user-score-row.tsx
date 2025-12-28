import { TrophyIcon } from "lucide-react";

import { User } from "@/types/database-camel-case";

export const UserScoreRow = ({
  user,
  score,
  isWinning,
  isCurrentUser,
  onClick,
}: UserScoreRowProps) => {
  const { avatarEmoji, name } = user;
  const { percentage } = score;

  return (
    <button
      onClick={onClick}
      className="group hover:bg-muted/50 w-full cursor-pointer rounded-lg p-3 text-left transition-colors"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <UserAvatar
            avatarEmoji={avatarEmoji}
            isWinning={isWinning}
            isCurrentUser={isCurrentUser}
          />
          <UserInfo
            userName={name}
            percentage={percentage}
            isWinning={isWinning}
            isCurrentUser={isCurrentUser}
          />
        </div>
        <ScoreProgressBar score={score} isCurrentUser={isCurrentUser} />
      </div>
    </button>
  );
};

interface UserScoreRowProps {
  user: User;
  score: { completed: number; total: number; percentage: number };
  isWinning: boolean;
  isCurrentUser: boolean;
  onClick: () => void;
}

const UserAvatar = ({
  avatarEmoji,
  isWinning,
  isCurrentUser,
}: UserAvatarProps) => {
  const ringClass = getRingClass(isWinning, isCurrentUser);

  return (
    <div
      className={`bg-primary/10 flex size-10 items-center justify-center rounded-md transition-all ${ringClass}`}
    >
      <span className="text-xl">{avatarEmoji}</span>
    </div>
  );
};

interface UserAvatarProps {
  avatarEmoji: string;
  isWinning: boolean;
  isCurrentUser: boolean;
}

const UserInfo = ({
  userName,
  percentage,
  isWinning,
  isCurrentUser,
}: UserInfoProps) => {
  const percentageColor = isCurrentUser ? "text-primary" : "text-accent";

  return (
    <div className="flex flex-1 items-center justify-between">
      <span className="text-foreground group-hover:text-primary font-semibold transition-colors">
        {userName}
        {isCurrentUser ? (
          <span className="text-muted-foreground text-sm"> (You)</span>
        ) : null}
      </span>
      <div className="flex items-center gap-1">
        {isWinning ? <TrophyIcon className="h-4 w-4 text-yellow-500" /> : null}
        <span className={`font-bold ${percentageColor}`}>{percentage}%</span>
      </div>
    </div>
  );
};

interface UserInfoProps {
  userName: string;
  percentage: number;
  isWinning: boolean;
  isCurrentUser: boolean;
}

const ScoreProgressBar = ({ score, isCurrentUser }: ScoreProgressBarProps) => {
  const { completed, total, percentage } = score;
  const progressBarColor = isCurrentUser ? "bg-primary" : "bg-accent";

  return (
    <div className="flex items-center justify-between gap-x-10">
      <div className="bg-muted h-3 flex-1 overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-muted-foreground text-xs">
        {completed}/{total}
      </span>
    </div>
  );
};

interface ScoreProgressBarProps {
  score: { completed: number; total: number; percentage: number };
  isCurrentUser: boolean;
}

const getRingClass = (isWinning: boolean, isCurrentUser: boolean): string => {
  if (!isWinning) return "";

  const ringColor = isCurrentUser ? "ring-primary" : "ring-accent";
  return `ring-2 ${ringColor} ring-offset-2 ring-offset-card`;
};
