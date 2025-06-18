import { X, ThumbsUp, ArrowRight } from 'lucide-react';

interface AppPromoModalProps {
  handleModalClose: () => void;
}
export default function AppPromoModal({
  handleModalClose,
}: AppPromoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div className="w-full max-w-md animate-scaleIn">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
          <button
            className="absolute top-2 right-2 text-white/70 hover:text-white z-10 p-1"
            aria-label="Dismiss"
            onClick={handleModalClose}
          >
            <X size={20} />
          </button>

          <div className="flex items-center">
            <div className="mr-3 bg-white rounded-full p-2">
              <ThumbsUp size={20} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">
                Enjoying this experience?
              </h3>
              <p className="text-white/80 text-sm mt-1">
                Use the Combifi App to skip passwords next time and access more
                features!
              </p>
              <a
                href="https://www.combifi.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 px-4 py-2 rounded-lg bg-white text-indigo-600 font-medium text-sm hover:bg-indigo-100 transition-colors"
              >
                Learn more about Combifi
                <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-white/10 z-0"></div>
          <div className="absolute -right-2 -top-5 h-16 w-16 rounded-full bg-white/10 z-0"></div>
        </div>
      </div>
    </div>
  );
}
