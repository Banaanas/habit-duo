import { describe, expect, it } from "vitest";

import {
  transformCompletion,
  transformGoal,
  transformUser,
  transformWeek,
  transformWeeklyScore,
} from "@/lib/supabase/transformers";
import type {
  DbCompletion,
  DbGoal,
  DbUser,
  DbWeek,
  DbWeeklyScore,
} from "@/types/database";

describe("transformUser", () => {
  it("should transform snake_case to camelCase", () => {
    const dbUser: DbUser = {
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      avatar_emoji: "👨",
      auth_user_id: "auth-456",
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformUser(dbUser);

    expect(result).toEqual({
      id: "user-123",
      name: "John Doe",
      email: "john@example.com",
      avatarEmoji: "👨",
      authUserId: "auth-456",
      createdAt: "2024-01-01T00:00:00Z",
    });
  });
});

describe("transformWeek", () => {
  it("should transform snake_case to camelCase", () => {
    const dbWeek: DbWeek = {
      id: "week-123",
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      winner_id: "user-456",
      is_finalized: true,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformWeek(dbWeek);

    expect(result).toEqual({
      id: "week-123",
      startDate: "2024-01-01",
      endDate: "2024-01-07",
      winnerId: "user-456",
      isFinalized: true,
      createdAt: "2024-01-01T00:00:00Z",
    });
  });
});

describe("transformGoal", () => {
  it("should transform snake_case to camelCase", () => {
    const dbGoal: DbGoal = {
      id: "goal-123",
      user_id: "user-456",
      week_id: "week-789",
      title: "Exercise daily",
      description: "30 minutes of cardio",
      target_days: 5,
      created_at: "2024-01-01T00:00:00Z",
    };

    const result = transformGoal(dbGoal);

    expect(result).toEqual({
      id: "goal-123",
      userId: "user-456",
      weekId: "week-789",
      title: "Exercise daily",
      description: "30 minutes of cardio",
      targetDays: 5,
      createdAt: "2024-01-01T00:00:00Z",
    });
  });
});

describe("transformCompletion", () => {
  it("should transform snake_case to camelCase", () => {
    const dbCompletion: DbCompletion = {
      id: "completion-123",
      goal_id: "goal-456",
      completion_date: "2024-01-05",
      created_at: "2024-01-05T12:00:00Z",
    };

    const result = transformCompletion(dbCompletion);

    expect(result).toEqual({
      id: "completion-123",
      goalId: "goal-456",
      completionDate: "2024-01-05",
      createdAt: "2024-01-05T12:00:00Z",
    });
  });
});

describe("transformWeeklyScore", () => {
  it("should transform snake_case to camelCase", () => {
    const dbScore: DbWeeklyScore = {
      week_id: "week-123",
      start_date: "2024-01-01",
      end_date: "2024-01-07",
      is_finalized: true,
      user_id: "user-456",
      user_name: "John Doe",
      avatar_emoji: "👨",
      points: 35,
      total_goals: 5,
      max_possible_points: 35,
    };

    const result = transformWeeklyScore(dbScore);

    expect(result).toEqual({
      weekId: "week-123",
      startDate: "2024-01-01",
      endDate: "2024-01-07",
      isFinalized: true,
      userId: "user-456",
      userName: "John Doe",
      avatarEmoji: "👨",
      points: 35,
      totalGoals: 5,
      maxPossiblePoints: 35,
    });
  });
});
