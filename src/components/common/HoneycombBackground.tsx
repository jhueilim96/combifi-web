export default function HoneycombBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Soft honey color wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-amber-50/30 to-yellow-200/50 dark:from-amber-900/15 dark:via-amber-950/10 dark:to-yellow-900/10" />

      {/* Top-left honeycomb cluster */}
      <svg
        className="absolute -top-4 -left-6 w-48 h-48 text-gray-400 dark:text-gray-500"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M50 10 L80 27 L80 61 L50 78 L20 61 L20 27 Z"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M95 44 L125 61 L125 95 L95 112 L65 95 L65 61 Z"
          strokeWidth="1.5"
          opacity="0.2"
        />
        <path
          d="M50 78 L80 95 L80 129 L50 146 L20 129 L20 95 Z"
          strokeWidth="1.5"
          opacity="0.18"
        />
        <path
          d="M95 112 L125 129 L125 163 L95 180 L65 163 L65 129 Z"
          strokeWidth="1"
          opacity="0.12"
        />
      </svg>

      {/* Top-right honeycomb cluster */}
      <svg
        className="absolute -top-2 -right-8 w-44 h-44 text-gray-400 dark:text-gray-500"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M140 15 L170 32 L170 66 L140 83 L110 66 L110 32 Z"
          strokeWidth="1.5"
          opacity="0.2"
        />
        <path
          d="M95 49 L125 66 L125 100 L95 117 L65 100 L65 66 Z"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M140 83 L170 100 L170 134 L140 151 L110 134 L110 100 Z"
          strokeWidth="1"
          opacity="0.15"
        />
      </svg>

      {/* Middle-left cluster */}
      <svg
        className="absolute top-1/3 -left-10 w-36 h-52 text-gray-400 dark:text-gray-500"
        viewBox="0 0 150 220"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M45 20 L75 37 L75 71 L45 88 L15 71 L15 37 Z"
          strokeWidth="1.5"
          opacity="0.22"
        />
        <path
          d="M90 54 L120 71 L120 105 L90 122 L60 105 L60 71 Z"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M45 88 L75 105 L75 139 L45 156 L15 139 L15 105 Z"
          strokeWidth="1.5"
          opacity="0.18"
        />
        <path
          d="M45 156 L75 173 L75 207 L45 224 L15 207 L15 173 Z"
          strokeWidth="1"
          opacity="0.12"
        />
      </svg>

      {/* Middle-right cluster */}
      <svg
        className="absolute top-2/5 -right-6 w-40 h-48 text-gray-400 dark:text-gray-500"
        viewBox="0 0 180 200"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M125 15 L155 32 L155 66 L125 83 L95 66 L95 32 Z"
          strokeWidth="1.5"
          opacity="0.2"
        />
        <path
          d="M80 49 L110 66 L110 100 L80 117 L50 100 L50 66 Z"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M125 83 L155 100 L155 134 L125 151 L95 134 L95 100 Z"
          strokeWidth="1.5"
          opacity="0.22"
        />
        <path
          d="M80 117 L110 134 L110 168 L80 185 L50 168 L50 134 Z"
          strokeWidth="1"
          opacity="0.12"
        />
      </svg>

      {/* Bottom-left honeycomb cluster */}
      <svg
        className="absolute -bottom-8 -left-4 w-52 h-52 text-gray-400 dark:text-gray-500"
        viewBox="0 0 220 220"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M55 25 L85 42 L85 76 L55 93 L25 76 L25 42 Z"
          strokeWidth="1"
          opacity="0.15"
        />
        <path
          d="M100 59 L130 76 L130 110 L100 127 L70 110 L70 76 Z"
          strokeWidth="1.5"
          opacity="0.22"
        />
        <path
          d="M55 93 L85 110 L85 144 L55 161 L25 144 L25 110 Z"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M100 127 L130 144 L130 178 L100 195 L70 178 L70 144 Z"
          strokeWidth="1.5"
          opacity="0.18"
        />
        <path
          d="M145 93 L175 110 L175 144 L145 161 L115 144 L115 110 Z"
          strokeWidth="1"
          opacity="0.12"
        />
      </svg>

      {/* Bottom-right honeycomb cluster */}
      <svg
        className="absolute -bottom-6 -right-10 w-56 h-48 text-gray-400 dark:text-gray-500"
        viewBox="0 0 240 200"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M85 20 L115 37 L115 71 L85 88 L55 71 L55 37 Z"
          strokeWidth="1"
          opacity="0.12"
        />
        <path
          d="M130 54 L160 71 L160 105 L130 122 L100 105 L100 71 Z"
          strokeWidth="1.5"
          opacity="0.2"
        />
        <path
          d="M175 20 L205 37 L205 71 L175 88 L145 71 L145 37 Z"
          strokeWidth="1.5"
          opacity="0.18"
        />
        <path
          d="M85 88 L115 105 L115 139 L85 156 L55 139 L55 105 Z"
          strokeWidth="1.5"
          opacity="0.22"
        />
        <path
          d="M130 122 L160 139 L160 173 L130 190 L100 173 L100 139 Z"
          strokeWidth="1.5"
          opacity="0.25"
        />
        <path
          d="M175 88 L205 105 L205 139 L175 156 L145 139 L145 105 Z"
          strokeWidth="1"
          opacity="0.15"
        />
      </svg>

      {/* Small floating accent hexagons */}
      <svg
        className="absolute top-1/4 left-1/5 w-8 h-8 text-gray-400/20 dark:text-gray-500/10"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
      </svg>
      <svg
        className="absolute bottom-1/3 right-1/5 w-6 h-6 text-gray-400/15 dark:text-gray-500/8"
        viewBox="0 0 100 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      >
        <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
      </svg>
    </div>
  );
}
