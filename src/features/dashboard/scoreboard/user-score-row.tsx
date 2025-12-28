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
    <button onClick={onClick} className="w-full text-left group cursor-pointer">
      <div className="flex items-center gap-3 mb-2">
        <UserAvatar
          avatarEmoji={avatarEmoji}
          isWinning={isWinning}
          isCurrentUser={isCurrentUser}
        />
        <div className="flex-1">
          <UserInfo
            userName={name}
            percentage={percentage}
            isCurrentUser={isCurrentUser}
          />
          <ScoreProgressBar score={score} isCurrentUser={isCurrentUser} />
        </div>
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
      className={`flex items-center justify-center size-10 rounded-md bg-primary/10 transition-all ${ringClass}`}
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

const UserInfo = ({ userName, percentage, isCurrentUser }: UserInfoProps) => {
  const percentageColor = isCurrentUser ? "text-primary" : "text-accent";

  return (
    <div className="flex items-center justify-between">
      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
        {userName}
        {isCurrentUser ? (
          <span className="text-muted-foreground text-sm"> (You)</span>
        ) : null}
      </span>
      <span className={`font-bold ${percentageColor}`}>{percentage}%</span>
    </div>
  );
};

interface UserInfoProps {
  userName: string;
  percentage: number;
  isCurrentUser: boolean;
}

const ScoreProgressBar = ({ score, isCurrentUser }: ScoreProgressBarProps) => {
  const { completed, total, percentage } = score;
  const progressBarColor = isCurrentUser ? "bg-primary" : "bg-accent";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-12">
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
