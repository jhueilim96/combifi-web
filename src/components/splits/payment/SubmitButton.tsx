import { Check } from 'lucide-react';

interface SubmitButtonProps {
  handleBack?: () => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  isUpdate?: boolean;
  validationError: {
    name: string | null;
    amount: string | null;
    generic: string | null;
  };
}

export default function SubmitButton({
  handleSubmit,
  isLoading,
  isUpdate = false,
  validationError,
}: SubmitButtonProps) {
  const hasValidationErrors = () => {
    return (
      validationError.name !== null ||
      validationError.amount !== null ||
      validationError.generic !== null
    );
  };

  return (
    <div className="mt-8">
      <button
        type="button"
        disabled={hasValidationErrors() || isLoading}
        onClick={handleSubmit}
        className="w-full py-4 px-6 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span>Saving...</span>
        ) : (
          <>
            <span>{isUpdate ? 'Update' : 'Save'}</span>
            <Check size={20} />
          </>
        )}
      </button>
    </div>
  );
}
