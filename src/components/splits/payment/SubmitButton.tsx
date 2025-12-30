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
    <div className="flex gap-3 mt-8">
      <button
        type="button"
        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 font-semibold text-base border border-gray-200 dark:border-gray-600"
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
        className="flex-1"
      />
    </div>
  );
}
