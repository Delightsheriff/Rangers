import { z } from 'zod';

export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s-']+$/, {
      message: 'First name can only contain letters, spaces, hyphens, and apostrophes',
    }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' })
    .regex(/^[a-zA-Z\s-']+$/, {
      message: 'Last name can only contain letters, spaces, hyphens, and apostrophes',
    }),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
