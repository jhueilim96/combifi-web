'use client';

import Image from 'next/image';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="running-loader">
        <div className="logo-runner">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
        </div>
        <div className="ground" />
        <p className="loading-text">Loading...</p>
      </div>

      <style jsx>{`
        .running-loader {
          position: relative;
          width: 100px;
          height: 100px;
          margin: 0 auto;
          text-align: center;
        }

        .logo-runner {
          position: absolute;
          top: 30px;
          left: 0;
          animation:
            run 3s ease-in-out infinite,
            bounce 1.5s ease-in-out infinite;
        }

        .ground {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #dcdcdc;
          overflow: hidden;
        }

        .ground::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 4px;
          background: repeating-linear-gradient(
            90deg,
            #ccc,
            #ccc 10px,
            #eee 10px,
            #eee 20px
          );
          animation: moveGround 1.5s linear infinite;
        }

        .loading-text {
          bottom: 0;
          left: 0;
          width: 100%;
          font-size: 14px;
          color: #4a4a4a;
          font-weight: 600;
          margin-top: 3rem;
        }

        @keyframes run {
          0% {
            left: 0;
          }
          50% {
            left: calc(100% - 32px);
          }
          100% {
            left: 0;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            top: 30px;
          }
          50% {
            top: 10px;
          }
        }

        @keyframes moveGround {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
}
