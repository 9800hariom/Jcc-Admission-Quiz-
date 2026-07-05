import React from "react";

interface JccLogoProps {
  className?: string;
  size?: number;
}

export default function JccLogo({ className = "", size = 48 }: JccLogoProps) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md select-none"
      >
        {/* Outer Shield Frame - Navy Blue with Gold Trim */}
        <path
          d="M100 15 C150 15 175 35 175 80 C175 135 125 175 100 185 C75 175 25 135 25 80 C25 35 50 15 100 15 Z"
          fill="#1e293b"
          stroke="#f59e0b"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Inner Shield Border */}
        <path
          d="M100 25 C142 25 163 42 163 80 C163 125 120 160 100 171 C80 160 37 125 37 80 C37 42 58 25 100 25 Z"
          fill="#0f172a"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Division Lines - Gold cross quadrants */}
        <path d="M100 25 L100 170" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M37 80 L163 80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />

        {/* Top-Left Quadrant: Graduation Cap (Blue/Gold) */}
        <g transform="translate(50, 40) scale(0.45)">
          <path
            d="M50 10 L90 30 L50 50 L10 30 Z"
            fill="#3b82f6"
            stroke="#f59e0b"
            strokeWidth="3"
          />
          <path
            d="M25 38 L25 60 C25 70 75 70 75 60 L75 38"
            fill="#3b82f6"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M90 30 L95 55 C95 58 92 60 90 60" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <circle cx="90" cy="60" r="3" fill="#f59e0b" />
        </g>

        {/* Top-Right Quadrant: Digital Circuit (Blue/Green/Gold) */}
        <g transform="translate(110, 42) scale(0.45)">
          {/* Circuit Paths */}
          <path d="M15 15 L35 15 L50 35 L70 35" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          <path d="M15 45 L30 45 L45 25 L70 25" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
          {/* Node Circles */}
          <circle cx="15" cy="15" r="5" fill="#f59e0b" />
          <circle cx="15" cy="45" r="5" fill="#10b981" />
          <circle cx="70" cy="35" r="5" fill="#3b82f6" />
          <circle cx="70" cy="25" r="5" fill="#f59e0b" />
        </g>

        {/* Bottom-Left Quadrant: Wheat & Agriculture Leaf (Green/Gold) */}
        <g transform="translate(52, 95) scale(0.42)">
          {/* Leaf */}
          <path
            d="M10 50 C10 20 40 10 50 10 C50 10 40 40 20 50 Z"
            fill="#10b981"
            stroke="#f59e0b"
            strokeWidth="2.5"
          />
          {/* Wheat stalk */}
          <path d="M10 55 C20 40 35 30 50 25" stroke="#f59e0b" strokeWidth="3" fill="none" />
          <circle cx="28" cy="38" r="4.5" fill="#f59e0b" />
          <circle cx="36" cy="32" r="4.5" fill="#f59e0b" />
          <circle cx="44" cy="28" r="4.5" fill="#f59e0b" />
        </g>

        {/* Bottom-Right Quadrant: Academic Open Book (Gold/White) */}
        <g transform="translate(112, 100) scale(0.45)">
          <path
            d="M10 40 C25 25 45 25 50 30 C55 25 75 25 90 40 L90 10 C75 -5 55 -5 50 0 C45 -5 25 -5 10 10 Z"
            fill="#ffffff"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M50 0 L50 30" stroke="#f59e0b" strokeWidth="2" />
        </g>

        {/* Center core seal: Golden Star of Merit */}
        <polygon
          points="100,70 104,82 116,82 107,90 111,102 100,94 89,102 93,90 84,82 96,82"
          fill="#f59e0b"
          stroke="#1e293b"
          strokeWidth="1.5"
        />
      </svg>
      <div className="flex flex-col">
        <span className="font-display font-black text-lg tracking-tight text-slate-900 leading-none">
          JANAKPUR
        </span>
        <span className="font-sans font-bold text-xs tracking-wider text-emerald-600 leading-none mt-1">
          COMMUNITY COLLEGE
        </span>
      </div>
    </div>
  );
}
