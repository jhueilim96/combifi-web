import { useState } from 'react';
import Image from 'next/image';
import { Loader2, Download } from 'lucide-react';

interface QRCodeProps {
  name: string;
  qrUrl: string;
}
export default function QRCode({ name, qrUrl }: QRCodeProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [isQRLoading, setIsQRLoading] = useState(true);
  const [isEnlargedQRLoading, setIsEnlargedQRLoading] = useState(false);

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
    <div className="py-2 flex flex-col items-center">
      {/* QR Code Container - subtle background, compact sizing */}
      <div
        className="relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 cursor-pointer"
        onClick={() => {
          setIsEnlarged(true);
          setIsEnlargedQRLoading(true);
        }}
      >
        {/* White quiet zone for scannability */}
        <div className="bg-white dark:bg-gray-100 rounded-xl p-3">
          <div className="relative h-[160px] w-[160px]">
            {/* Loading indicator for main QR code */}
            {isQRLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-100 rounded">
                <Loader2 size={20} className="animate-spin text-indigo-400" />
              </div>
            )}

            <Image
              src={qrUrl}
              alt="Payment QR Code"
              fill
              sizes="160px"
              className={`rounded object-contain transition-opacity duration-300 ${isQRLoading ? 'opacity-0' : 'opacity-100'}`}
              unoptimized={true}
              onLoad={() => setIsQRLoading(false)}
              onError={() => setIsQRLoading(false)}
            />
          </div>
        </div>
      </div>

      {/* Enlarged modal */}
      {isEnlarged && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-zoom-out"
          onClick={() => setIsEnlarged(false)}
        >
          <div className="relative w-[90vw] h-[90vh] max-w-[400px] max-h-[400px]">
            {isEnlargedQRLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-white" />
              </div>
            )}

            <Image
              src={qrUrl}
              alt="Enlarged QR Code"
              fill
              className={`object-contain transition-opacity duration-300 ${isEnlargedQRLoading ? 'opacity-0' : 'opacity-100'}`}
              unoptimized
              onLoad={() => setIsEnlargedQRLoading(false)}
              onError={() => setIsEnlargedQRLoading(false)}
            />
          </div>
        </div>
      )}

      {/* Compact download button - subtle border for clickability */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`mt-3 inline-flex items-center gap-2 py-1.5 px-4 rounded-full text-xs font-medium transition-all duration-200 ${
          isDownloading
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700 cursor-not-allowed'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow hover:border-gray-300 dark:hover:border-gray-500 active:scale-[0.98]'
        }`}
      >
        {isDownloading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download size={14} />
            <span>Download</span>
          </>
        )}
      </button>
    </div>
  );
}
