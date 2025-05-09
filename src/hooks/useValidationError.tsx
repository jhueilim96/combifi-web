import { getZodValidationErrorMessage } from '@/lib/validations';
import { useState } from 'react';
import { z } from 'zod';

export default function useValidationError() {
  const [validationError, setValidationError] = useState<{
    name: string | null;
    amount: string | null;
    generic: string | null;
  }>({
    name: null,
    amount: null,
    generic: null,
  });

  const updateValidationError = (
    field: 'name' | 'amount' | 'generic',
    message: string | null
  ) => {
    setValidationError((prev) => ({ ...prev, [field]: message }));
  };

  const resetValidationError = () => {
    setValidationError({
      name: null,
      amount: null,
      generic: null,
    });
  };

  const handleValidation = (
    input: {
      name: string;
      amount: string;
    },
    field: 'name' | 'amount' | 'generic',
    value: string,
    validateionSchema: z.ZodSchema
  ) => {
    if (validationError[field]) updateValidationError(field, null);

    // Optional: real-time validation
    try {
      validateionSchema.parse({
        ...input,
        [field]: value,
      });
    } catch (error) {
      if (error instanceof Error) {
        const validationErrorMessage = getZodValidationErrorMessage(
          error,
          field
        );
        if (validationErrorMessage)
          updateValidationError(field, validationErrorMessage);
      }
    }
  };

  return {
    validationError,
    updateValidationError,
    resetValidationError,
    handleValidation,
  };
}
