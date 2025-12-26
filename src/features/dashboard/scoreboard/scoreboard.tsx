"use client";

import { Crown, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";

import { User } from "@/types/database-camel-case";

interface ScoreboardProps {
  currentUser: User;
  friendUser: User;
  currentScore: { completed: number; total: number; percentage: number };
  friendScore: { completed: number; total: number; percentage: number };
}

export const Scoreboard = ({
  currentUser,
  friendUser,
  currentScore,
  friendScore,
}: ScoreboardProps) => {
  const router = useRouter();
  const [, setSelectedUserId] = useQueryState(
    "selected",
    parseAsString.withDefault(currentUser.id)
  );

  const onUserClick = async (userId: string) => {
    await setSelectedUserId(userId);
    router.refresh();
  };
  const currentWinning = currentScore.percentage > friendScore.percentage;
  const friendWinning = friendScore.percentage > currentScore.percentage;
  const tied = currentScore.percentage === friendScore.percentage;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-lg text-foreground">
          This Week's Battle
        </h2>
      </div>

      <div className="flex flex-col gap-y-4">
        <UserScoreRow
          user={currentUser}
          score={currentScore}
          isWinning={currentWinning}
          isCurrentUser={true}
          onClick={() => onUserClick(currentUser.id)}
        />

        {tied && (
          <div className="text-center text-sm text-muted-foreground font-medium">
            🤝 Tied! Keep pushing!
          </div>
        )}

        <UserScoreRow
          user={friendUser}
          score={friendScore}
          isWinning={friendWinning}
          isCurrentUser={false}
          onClick={() => onUserClick(friendUser.id)}
        />
      </div>
    </div>
  );
};

interface UserScoreRowProps {
  user: User;
  score: { completed: number; total: number; percentage: number };
  isWinning: boolean;
  isCurrentUser: boolean;
  onClick: () => void;
}

const UserScoreRow = ({
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
