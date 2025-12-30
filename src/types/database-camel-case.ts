// App types (camelCase) - what the application uses
// These follow JavaScript naming conventions

export type User = {
  id: string;
  name: string;
  email: string;
  avatarEmoji: string;
  authUserId: string | null;
  createdAt: string;
};

export type Week = {
  id: string;
  startDate: string;
  endDate: string;
  winnerId: string | null;
  isFinalized: boolean;
  createdAt: string;
};

export type Goal = {
  id: string;
  userId: string;
  weekId: string;
  title: string;
  description: string | null;
  targetDays: number;
  createdAt: string;
};

export type Completion = {
  id: string;
  goalId: string;
  completionDate: string;
  createdAt: string;
};

export type WeeklyScore = {
  weekId: string;
  startDate: string;
  endDate: string;
  isFinalized: boolean;
  userId: string;
  userName: string;
  avatarEmoji: string;
  points: number;
  totalGoals: number;
  maxPossiblePoints: number;
};
