import { z } from 'zod';
import { CATEGORIES } from '../constants';

const defaultSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  created_at: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  description: z.string().optional(),
});

const incomeSchema = z.object({
  type: z.literal('Income'),
});

const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(CATEGORIES),
});

const investmentSchema = z.object({
  type: z.literal('Investment'),
});

const savingSchema = z.object({
  type: z.literal('Saving'),
});

export const transactionSchema = z.intersection(
  z.discriminatedUnion('type', [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);
