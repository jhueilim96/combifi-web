import { Button } from '@/components/ui/Button';

interface SubmitButtonProps {
  handleBack?: () => void;
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
    <div className="mt-8">
      <Button
        disabled={hasValidationErrors() || isLoading}
        isLoading={isLoading}
        onClick={handleSubmit}
        className="w-full"
        text="Update"
      />
    </div>
  );
}
