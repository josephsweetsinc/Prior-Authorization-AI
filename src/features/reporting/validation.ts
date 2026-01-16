import { z } from 'zod';

export const reportSchema = z.object({
  days: z.string('Date is required field'),
  format: z.enum(['excel', 'pdf'], { message: 'Format must be Excel or PDF' }),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
