import { z } from 'zod';

export const confirmUserSchema = z.object({ userId: z.string() });
export const deleteUserSchema = z.object({ userId: z.string() });
