export const FlowerMetalIcon = () => {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flower-metal-icon"
    >
      {/* Flower petals */}
      <circle
        cx="32"
        cy="16"
        r="8"
        fill="#FF69B4"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="48"
        cy="32"
        r="8"
        fill="#FF69B4"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="32"
        cy="48"
        r="8"
        fill="#FF69B4"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="16"
        cy="32"
        r="8"
        fill="#FF69B4"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="42"
        cy="22"
        r="6"
        fill="#FFB6C1"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="42"
        cy="42"
        r="6"
        fill="#FFB6C1"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="22"
        cy="42"
        r="6"
        fill="#FFB6C1"
        stroke="#000"
        strokeWidth="2"
      />
      <circle
        cx="22"
        cy="22"
        r="6"
        fill="#FFB6C1"
        stroke="#000"
        strokeWidth="2"
      />

      {/* Metal center - skull-like */}
      <circle
        cx="32"
        cy="32"
        r="10"
        fill="#1a1a1a"
        stroke="#666"
        strokeWidth="2"
      />
      <circle cx="28" cy="30" r="2" fill="#FF0000" />
      <circle cx="36" cy="30" r="2" fill="#FF0000" />
      <path
        d="M 28 36 L 32 38 L 36 36"
        stroke="#666"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};
