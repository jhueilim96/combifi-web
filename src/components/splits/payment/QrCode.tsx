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
    <div className="py-4">
      <div className="text-center space-y-2 mb-2">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Pay {name} with DuitNow QR
        </h3>
      </div>
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <div
          className="relative h-[200px] w-[200px]"
          onClick={() => {
            setIsEnlarged(true);
            setIsEnlargedQRLoading(true);
          }}
        >
          {/* Loading indicator for main QR code */}
          {isQRLoading && (
            <div className="absolute inset-0 flex items-center justify-center border border-indigo-50 rounded">
              <Loader2 size={24} className="animate-spin text-indigo-400" />
            </div>
          )}

          <Image
            src={qrUrl}
            alt="Payment QR Code"
            fill
            sizes="200px"
            className={`rounded object-contain transition-opacity duration-300 ${isQRLoading ? 'opacity-0' : 'opacity-100'}`}
            unoptimized={true} // Use unoptimized for S3 signed URLs as they can't be optimized by Next.js
            onLoad={() => setIsQRLoading(false)}
            onError={() => setIsQRLoading(false)}
          />
        </div>
        {isEnlarged && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-zoom-out"
            onClick={() => setIsEnlarged(false)}
          >
            <div className="relative w-[90vw] h-[90vh] max-w-[400px] max-h-[400px]">
              {/* Loading indicator for enlarged QR code */}
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
              <Loader2
                size={20}
                className="animate-spin mr-2 text-gray-600 dark:text-gray-400"
              />
              Downloading...
            </>
          ) : (
            <>
              <Download size={20} className="mr-2" />
              Download
            </>
          )}
        </button>
      </div>
    </div>
  );
}
