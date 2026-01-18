import { ReactNode } from 'react';

interface RoundedHexagonProps {
  children: ReactNode;
  className?: string;
  bgClassName?: string;
}

export default function RoundedHexagon({
  children,
  className = 'w-12 h-12',
  bgClassName = 'text-gray-100 dark:text-indigo-900',
}: RoundedHexagonProps) {
  return (
    <div className={`relative ${className}`}>
      {/* SVG Hexagon Background */}
      <svg
        viewBox="0 0 100 100"
        className={`absolute inset-0 w-full h-full ${bgClassName}`}
        fill="currentColor"
      >
        <path
          d="M3 50
             L27 10
             Q29 7 33 7
             L67 7
             Q71 7 73 10
             L97 50
             Q97 50 97 50
             L73 90
             Q71 93 67 93
             L33 93
             Q29 93 27 90
             L3 50
             Q3 50 3 50"
          strokeLinejoin="round"
        />
      </svg>
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
}
