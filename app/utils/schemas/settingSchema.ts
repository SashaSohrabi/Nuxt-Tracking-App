import { z } from 'zod';

export const settingSchema = z.object({
  transactionView: z.enum(TRANSACTION_VIEW_OPTIONS),
});
