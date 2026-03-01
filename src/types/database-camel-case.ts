// App types (camelCase) - what the application uses
// These follow JavaScript naming conventions

export interface User {
  id: string;
  name: string;
  email: string;
  avatarEmoji: string;
  authUserId: string | null;
  createdAt: string;
}

export interface Week {
  id: string;
  startDate: string;
  endDate: string;
  winnerId: string | null;
  isFinalized: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  targetDays: number;
  createdAt: string;
}

export interface Completion {
  id: string;
  goalId: string;
  completionDate: string;
  createdAt: string;
}

export interface WeeklyScore {
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
}
