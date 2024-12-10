import { z } from 'zod';

export const profileSchema = z.object({
  fullname: z.string().min(3).optional(),
  email: z.string().email(),
});

