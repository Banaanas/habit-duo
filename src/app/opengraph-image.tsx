import { ImageResponse } from "next/og";

import { appName, appSlogan } from "@/data/app-data";

export const alt = appName;

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const Image = () => {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
        }}
      >
        {/* Logo - Two interlocking rings */}
        <svg
          width="160"
          height="100"
          viewBox="0 0 160 100"
          style={{ marginBottom: "48px" }}
        >
          <defs>
            <linearGradient
              id="ringGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>
          </defs>
          {/* Left ring */}
          <circle
            cx="55"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="10"
          />
          {/* Right ring */}
          <circle
            cx="105"
            cy="50"
            r="35"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="10"
          />
        </svg>

        {/* App name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-2px",
          }}
        >
          {appName}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#9ca3af",
            marginTop: "16px",
          }}
        >
          {appSlogan}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
};

export default Image;
