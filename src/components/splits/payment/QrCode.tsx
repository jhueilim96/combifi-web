import { useState } from 'react';
import Image from 'next/image';

interface QrCodeProps {
  name: string;
  qrUrl: string;
}
export default function QrCode({ name, qrUrl }: QrCodeProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsDownloading(true);

    try {
      // Use our proxy API endpoint instead of fetching directly
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(qrUrl)}&hostName=${name}`;

      // Fetch the image through our proxy
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to download: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();

      // Create a temporary link and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${name}-payment-qr-code.png`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert(
        'Failed to download QR code: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="text-center space-y-2 mb-2">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Pay {name} with DuitNow QR
        </h3>
      </div>
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <div className="relative h-[200px] w-[200px]">
          <Image
            src={qrUrl}
            alt="Payment QR Code"
            fill
            sizes="200px"
            className="rounded object-contain"
            unoptimized={true} // Use unoptimized for S3 signed URLs as they can't be optimized by Next.js
          />
        </div>
      </div>
      <div className="mt-2">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center justify-center w-full py-2 px-4 ${
            isDownloading
              ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
          } text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 text-sm font-medium`}
        >
          {isDownloading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-gray-600 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}
