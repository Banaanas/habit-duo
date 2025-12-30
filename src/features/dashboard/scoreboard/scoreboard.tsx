"use client";

import { FlameIcon, SwordsIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";

import { UserScoreRow } from "@/features/dashboard/scoreboard/user-score-row";
import { QUERY_PARAMS } from "@/lib/query-params";
import { User } from "@/types/database-camel-case";

export const Scoreboard = ({
  currentUser,
  friendUser,
  currentScore,
  friendScore,
}: ScoreboardProps) => {
  const router = useRouter();
  const [, setSelectedUserId] = useQueryState(
    QUERY_PARAMS.selectedUserId,
    parseAsString.withDefault(currentUser.id)
  );

  const onUserClick = async (userId: string) => {
    await setSelectedUserId(userId);
    router.refresh();
  };

  const { currentWinning, friendWinning, isGameTied } = calculateWinningStatus(
    currentScore,
    friendScore
  );

  const leadingUser = currentWinning
    ? currentUser
    : friendWinning
      ? friendUser
      : null;

  return (
    <div className="bg-card border-border flex flex-col gap-y-4 rounded-2xl border p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-x-2">
          <div className="from-primary to-accent flex size-9 items-center justify-center rounded-full bg-gradient-to-br">
            <SwordsIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-foreground text-lg font-bold">
            Battle of the Week
          </h2>
        </div>
        {leadingUser ? <LeaderIndicator leadingUser={leadingUser} /> : null}
      </div>

      <div className="flex flex-col gap-y-6">
        <UserScoreRow
          user={currentUser}
          score={currentScore}
          isWinning={currentWinning}
          isCurrentUser={true}
          onClick={() => onUserClick(currentUser.id)}
        />

        {isGameTied ? <TiedGameText /> : null}

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

const TiedGameText = () => {
  return (
    <div className="text-muted-foreground py-2 text-center text-sm font-medium">
      🤝 Tied! Keep pushing!
    </div>
  );
};

const LeaderIndicator = ({ leadingUser }: LeaderIndicatorProps) => {
  return (
    <div className="text-muted-foreground flex items-center justify-center gap-x-1 text-sm">
      <FlameIcon className="h-4 w-4 text-orange-500" />
      <span className="font-medium">{leadingUser.name} leads!</span>
    </div>
  );
};

interface LeaderIndicatorProps {
  leadingUser: User;
}

const calculateWinningStatus = (
  currentScore: { percentage: number },
  friendScore: { percentage: number }
): WinningStatus => {
  const currentWinning = currentScore.percentage > friendScore.percentage;
  const friendWinning = friendScore.percentage > currentScore.percentage;
  const isGameTied = currentScore.percentage === friendScore.percentage;

  return { currentWinning, friendWinning, isGameTied };
};

interface WinningStatus {
  currentWinning: boolean;
  friendWinning: boolean;
  isGameTied: boolean;
}
