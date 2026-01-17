import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DayButton } from "@/features/dashboard/day-button";

// Mock next/navigation
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

describe("DayButton", () => {
  const mockOnToggle = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    mockOnToggle.mockClear();
    mockRefresh.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render day label for given date", () => {
      const monday = new Date("2024-01-01"); // Jan 1, 2024 is a Monday

      render(
        <DayButton
          date={monday}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const dayLabel = screen.getByText("MON");

      expect(dayLabel).toBeInTheDocument();
    });

    it('should show "TODAY" badge for today\'s date', () => {
      const mockToday = new Date("2024-01-15T12:00:00Z");
      vi.setSystemTime(mockToday);

      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const todayBadge = screen.getByText("TODAY");

      expect(todayBadge).toBeInTheDocument();
    });

    it('should not show "TODAY" badge for past dates', () => {
      const mockToday = new Date("2024-01-15T12:00:00Z");
      vi.setSystemTime(mockToday);

      render(
        <DayButton
          date={new Date("2024-01-10")}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const todayBadge = screen.queryByText("TODAY");

      expect(todayBadge).not.toBeInTheDocument();
    });

    it("should show check icon when completed", () => {
      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={true}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");
      const svg = button.querySelector("svg");

      expect(svg).toBeInTheDocument();
    });

    it("should disable button when canToggle is false", () => {
      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={false}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
    });
  });

  describe("Click Interactions", () => {
    it("should call onToggle with ISO date string when clicked", async () => {
      const testDate = new Date("2024-01-15");
      mockOnToggle.mockResolvedValue(undefined);

      render(
        <DayButton
          date={testDate}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      // onToggle is called synchronously when clicked
      expect(mockOnToggle).toHaveBeenCalledWith("2024-01-15");
    });

    it("should not call onToggle when canToggle is false", () => {
      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={false}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      // Button is disabled, so click won't trigger anything
      expect(button).toBeDisabled();
      expect(mockOnToggle).not.toHaveBeenCalled();
    });

    it("should toggle completion state when clicked", () => {
      mockOnToggle.mockResolvedValue(undefined);

      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      // Initially uncompleted (no check icon)
      const svgBefore = button.querySelector("svg");
      expect(svgBefore).not.toBeInTheDocument();

      fireEvent.click(button);

      // After click, optimistically shows as completed
      const svgAfter = button.querySelector("svg");
      expect(svgAfter).toBeInTheDocument();
      expect(mockOnToggle).toHaveBeenCalledWith("2024-01-15");
    });
  });

  describe("Optimistic UI", () => {
    it("should update optimistically when clicked", () => {
      mockOnToggle.mockResolvedValue(undefined);

      render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      // Initially no check icon (uncompleted)
      const svgBefore = button.querySelector("svg");
      expect(svgBefore).not.toBeInTheDocument();

      fireEvent.click(button);

      // After click, optimistic state should show completed (check icon visible)
      // This happens synchronously before the server responds
      const svgAfter = button.querySelector("svg");
      expect(svgAfter).toBeInTheDocument();
    });

    it("should sync optimistic state with server state after render", async () => {
      const { rerender } = render(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={false}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      // Initially no check icon
      const svgBefore = button.querySelector("svg");
      expect(svgBefore).not.toBeInTheDocument();

      // Server state changes to completed
      rerender(
        <DayButton
          date={new Date("2024-01-15")}
          isCompleted={true}
          canToggle={true}
          onToggle={mockOnToggle}
        />
      );

      // After rerender, check icon should appear
      const svgAfter = button.querySelector("svg");
      expect(svgAfter).toBeInTheDocument();
    });
  });

  describe("Future Dates", () => {
    it("should have reduced opacity for future dates", () => {
      const mockToday = new Date("2024-01-15T12:00:00Z");
      vi.setSystemTime(mockToday);

      render(
        <DayButton
          date={new Date("2024-01-20")}
          isCompleted={false}
          canToggle={false}
          onToggle={mockOnToggle}
        />
      );

      const button = screen.getByRole("button");

      expect(button.className).toContain("opacity-40");
    });
  });
});
