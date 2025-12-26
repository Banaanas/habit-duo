"use client";

import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";

import { UserScoreRow } from "@/features/dashboard/scoreboard/user-score-row";
import { User } from "@/types/database-camel-case";

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

  const { currentWinning, friendWinning, tied } = calculateWinningStatus(
    currentScore,
    friendScore
  );

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

        {tied ? (
          <div className="text-center text-sm text-muted-foreground font-medium">
            🤝 Tied! Keep pushing!
          </div>
        ) : null}

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

interface ScoreboardProps {
  currentUser: User;
  friendUser: User;
  currentScore: { completed: number; total: number; percentage: number };
  friendScore: { completed: number; total: number; percentage: number };
}

interface WinningStatus {
  currentWinning: boolean;
  friendWinning: boolean;
  tied: boolean;
}

const calculateWinningStatus = (
  currentScore: { percentage: number },
  friendScore: { percentage: number }
): WinningStatus => {
  const currentWinning = currentScore.percentage > friendScore.percentage;
  const friendWinning = friendScore.percentage > currentScore.percentage;
  const tied = currentScore.percentage === friendScore.percentage;

  return { currentWinning, friendWinning, tied };
};
