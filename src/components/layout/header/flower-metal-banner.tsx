import { cn } from "@/lib/utils";

export const FlowerMetalBanner = ({
  size = 280,
  flowerColor = "#FFFFFF",
  metalColor = "#FF69B4",
  strokeColor,
  className,
}: FlowerMetalBannerProps) => {
  return (
    <svg
      width={size}
      viewBox="10 10 155 82"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block", className)}
      preserveAspectRatio="xMinYMin meet"
    >
      {/* FLOWER */}
      <g
        fill={flowerColor}
        stroke={strokeColor ?? flowerColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M 10 15 L 15 10 L 28 10 L 32 13 L 30 15 L 18 15 L 17 22 L 26 22 L 28 24 L 17 24 L 15 40 L 10 42 Z" />
        <path d="M 35 10 L 40 12 L 40 38 L 52 37 L 54 42 L 35 42 Z" />
        <path d="M 58 10 L 72 10 L 77 15 L 77 37 L 72 42 L 58 42 L 53 37 L 53 15 Z M 60 15 L 60 37 L 70 37 L 70 15 Z" />
        <path d="M 82 10 L 87 12 L 90 35 L 95 12 L 100 10 L 105 12 L 108 35 L 111 12 L 116 10 L 113 42 L 107 42 L 102 20 L 97 42 L 91 42 Z" />
        <path d="M 120 10 L 138 10 L 140 15 L 128 15 L 127 22 L 137 22 L 138 27 L 127 27 L 127 37 L 140 37 L 142 42 L 120 42 Z" />
        <path d="M 145 10 L 160 10 L 165 15 L 165 22 L 160 26 L 167 42 L 160 42 L 154 27 L 152 27 L 152 42 L 145 42 Z M 150 15 L 150 22 L 158 22 L 158 15 Z" />
      </g>

      {/* METAL */}
      <g
        fill={metalColor}
        stroke={strokeColor ?? metalColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M 10 87 L 10 55 L 15 52 L 24 70 L 33 52 L 38 55 L 38 87 L 33 87 L 33 65 L 24 80 L 15 65 L 15 87 Z" />
        <path d="M 42 55 L 60 55 L 62 60 L 50 60 L 49 67 L 59 67 L 60 72 L 49 72 L 49 82 L 62 82 L 64 87 L 42 87 Z" />
        <path d="M 68 55 L 101 55 L 103 60 L 89 60 L 89 87 L 82 87 L 82 60 L 68 60 Z" />
        <path d="M 106 55 L 113 52 L 131 87 L 124 92 L 121 82 L 106 82 L 103 92 L 96 87 Z M 109 77 L 118 77 L 113 62 Z" />
        <path d="M 136 55 L 141 57 L 141 82 L 153 82 L 155 87 L 136 87 Z" />
      </g>
    </svg>
  );
};

interface FlowerMetalBannerProps {
  size?: number;
  flowerColor?: string;
  metalColor?: string;
  strokeColor?: string;
  className?: string;
}
