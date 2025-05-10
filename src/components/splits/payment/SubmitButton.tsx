import { Button } from '@/components/ui/Button';

interface SubmitButtonProps {
  handleBack: () => void;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  validationError: {
    name: string | null;
    amount: string | null;
    generic: string | null;
  };
}
export default function SubmitButton({
  handleBack,
  handleSubmit,
  isLoading,
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
    <div className="flex space-x-3">
      <button
        type="button"
        className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md text-lg mt-2"
        onClick={() => {
          handleBack();
        }}
      >
        Back
      </button>

      <Button
        disabled={hasValidationErrors() || isLoading}
        isLoading={isLoading}
        onClick={handleSubmit}
      />
    </div>
  );
}
