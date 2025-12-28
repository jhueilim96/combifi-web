import { z } from 'zod';

export const participantAmountSchema = z
  .string()
  .refine((val) => val.trim() !== '', {
    message: 'Amount is required',
  })
  .refine((val) => !isNaN(Number(val)), {
    message: 'Amount must be a valid number',
  })
  .refine((val) => Number(val) > 0, {
    message: 'Amount must be greater than zero',
  });

export const participantNameSchema = z
  .string()
  .min(1, { message: 'Name is required' });

export const participantInputSchema = z.object({
  amount: participantAmountSchema,
  name: participantNameSchema,
});

export const paymentMethodMetadataSchema = z
  .object({
    label: z.string(),
    type: z.string(),
    paidAt: z.string().nullable(),
  })
  .nullable();

export const updateParticipantSchema = z.object({
  amount: participantAmountSchema,
  name: participantNameSchema,
  markAsPaid: z.boolean(),
  currency: z.string().min(1),
  paymentMethodMetadata: paymentMethodMetadataSchema,
});

export const insertParticipantSchema = z.object({
  amount: participantAmountSchema,
  name: participantNameSchema,
  markAsPaid: z.boolean(),
  currency: z.string().min(1),
  paymentMethodMetadata: paymentMethodMetadataSchema,
});

export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
export type InsertParticipantInput = z.infer<typeof insertParticipantSchema>;

export const getZodValidationErrorMessage = (
  error: Error,
  field: string
): string | null => {
  // Parse the error message object array
  const errorObj = JSON.parse(error.message);
  // Find the error object with path containing "field"
  const nameError = Array.isArray(errorObj)
    ? errorObj.find((err) => err.path && err.path.includes(field))
    : null;
  return nameError ? nameError.message : null;
};
