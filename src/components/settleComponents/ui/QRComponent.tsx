interface QRComponentProps {
  name: string;
  qrUrl: string;
}
export default function QRComponent({ name, qrUrl }: QRComponentProps) {
  return (
    <div className="py-4">
      <div className="text-center space-y-2 mb-2">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Pay {name} with DuitNow QR
        </h3>
      </div>
      <div className="flex justify-center bg-white p-4 rounded-lg">
        <img
          src={qrUrl}
          alt="Payment QR Code"
          width={200}
          height={200}
          className="rounded"
          style={{ maxHeight: '200px', width: 'auto' }}
        />
      </div>
      <div className="mt-2">
        <a
          href={qrUrl}
          download="payment-qr-code.png"
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 text-sm font-medium"
        >
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
        </a>
      </div>
    </div>
  );
}
