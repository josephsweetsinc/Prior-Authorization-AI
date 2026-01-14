import { z } from 'zod';

export const reportSchema = z.object({
  start_date: z.date('Start date is required'),
  end_date: z.date('End date is required'),
  format: z.enum(['excel', 'pdf'], { message: 'Format must be Excel or PDF' }),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
