import type { ReactNode } from "react";

type IconProps = { size?: number; color?: string; strokeWidth?: number };

function make(paths: ReactNode) {
  return function Icon({ size = 24, color = "currentColor", strokeWidth = 2 }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths}
      </svg>
    );
  };
}

export const StoreIcon = make(
  <>
    <path d="M3 9l2-5h14l2 5" />
    <path d="M4 9v11h16V9" />
    <path d="M9 20v-6h6v6" />
  </>
);

export const ChatIcon = make(<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />);

export const BulbIcon = make(
  <>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
  </>
);

export const RocketIcon = make(
  <>
    <path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z" />
    <path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0" />
    <path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" />
  </>
);

export const VideoIcon = make(
  <>
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </>
);

export const MegaphoneIcon = make(
  <>
    <path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z" />
    <path d="M17 8a5 5 0 0 1 0 8" />
    <path d="M20 5a9 9 0 0 1 0 14" />
  </>
);

export const PenIcon = make(
  <>
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.6 7.6" />
    <circle cx="11" cy="11" r="2" />
  </>
);

export const CodeIcon = make(
  <>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </>
);

export const TagIcon = make(
  <>
    <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" />
    <circle cx="7" cy="7" r="1.5" />
  </>
);

export const FilmIcon = make(
  <>
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
  </>
);

export const ChatCheckIcon = make(
  <>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 10l3 3 5-5" />
  </>
);
