import { Crown } from "lucide-react";

import { User } from "@/types/database-camel-case";

export const UserScoreRow = ({
  user,
  score,
  isWinning,
  isCurrentUser,
  onClick,
}: UserScoreRowProps) => {
  return (
    <button onClick={onClick} className="w-full text-left group cursor-pointer">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative">
          <span className="text-3xl">{user.avatarEmoji}</span>
          {isWinning && (
            <Crown className="absolute -top-2 -right-1 w-4 h-4 text-yellow-500" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {user.name}
              {isCurrentUser && (
                <span className="text-muted-foreground text-sm"> (You)</span>
              )}
            </span>
            <span
              className={`font-bold ${isCurrentUser ? "text-primary" : "text-secondary"}`}
            >
              {score.percentage}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCurrentUser ? "bg-primary" : "bg-secondary"
                }`}
                style={{ width: `${score.percentage}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-12">
              {score.completed}/{score.total}
            </span>
          </div>
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
